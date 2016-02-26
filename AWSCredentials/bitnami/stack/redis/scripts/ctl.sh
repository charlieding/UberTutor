#! /bin/sh

REDIS_ROOTDIR=/opt/bitnami/redis
[ -z "$REDIS_PIDFILE" ] && REDIS_PIDFILE=$REDIS_ROOTDIR/var/redis.pid
[ -z "$REDIS_CONFIG_FILE" ] && REDIS_CONFIG_FILE=$REDIS_ROOTDIR/etc/redis.conf
[ -z "$REDIS_PORT" ] && REDIS_PORT=6379
[ -z "$REDIS_NAME" ] && REDIS_NAME=redis

REDIS_SERVER=$REDIS_ROOTDIR/bin/redis-server
REDIS_CLI=$REDIS_ROOTDIR/bin/redis-cli
REDIS_STATUS=""
REDIS_PID=""
REDIS_START="$REDIS_SERVER $REDIS_CONFIG_FILE"

ERROR=0


get_pid() {
    PID=""
    PIDFILE=$1
    # check for pidfile
    if [ -f "$PIDFILE" ] ; then
        PID=`cat $PIDFILE`
    fi
}
get_redis_port() {
    PORT=`grep -E "^ *port +([0-9]+) *$" "$REDIS_CONFIG_FILE" | grep -Eo "[0-9]+"`
    SUCCESS=$?
    if [ $SUCCESS -eq 0 ]; then
	REDIS_PORT=$PORT
    else
	echo "Cannot parse redis-server port from $REDIS_CONFIG_FILE. Using default port $REDIS_PORT"
	REDIS_PORT=6379
    fi
}

get_redis_pid() {
    get_pid $REDIS_PIDFILE
    if [ ! "$PID" ]; then
        return
    fi
    if [ "$PID" -gt 0 ]; then
        REDIS_PID=$PID
    fi
}

is_service_running() {
    PID=$1
    if [ "x$PID" != "x" ] && kill -0 $PID 2>/dev/null ; then
        RUNNING=1
    else
        RUNNING=0
    fi
    return $RUNNING
}

is_redis_running() {
    get_redis_pid
    is_service_running $REDIS_PID
    RUNNING=$?
    if [ $RUNNING -eq 0 ]; then
        REDIS_STATUS="$REDIS_NAME not running"
    else
        REDIS_STATUS="$REDIS_NAME already running"
    fi
    return $RUNNING
}

start_redis() {
    is_redis_running
    RUNNING=$?

    if [ $RUNNING -eq 1 ]; then
        echo "$0 $ARG: redis (pid $REDIS_PID) already running"
    else
	if [ `id|sed -e s/uid=//g -e s/\(.*//g` -eq 0 ]; then
	    su redis -s /bin/sh -c "$REDIS_START"
	else
	    $REDIS_START
	fi
	sleep 3
	is_redis_running
	RUNNING=$?
	if [ $RUNNING -eq 0 ]; then
	    ERROR=1
	fi

        if [ $ERROR -eq 0 ]; then
            echo "$0 $ARG: $REDIS_NAME started"
	    sleep 2
        else
            echo "$0 $ARG: $REDIS_NAME could not be started"
            ERROR=3
        fi
    fi
}

stop_redis() {
    NO_EXIT_ON_ERROR=$1
    is_redis_running
    RUNNING=$?

    if [ $RUNNING -eq 0 ]; then
        echo "$0 $ARG: $REDIS_STATUS"
        if [ "x$NO_EXIT_ON_ERROR" != "xno_exit" ]; then
            exit
        else
            return
        fi
    fi

    PASSWORD=`grep -E "^\s*requirepass" $REDIS_CONFIG_FILE | awk '{print $2}'`
    PORT=`grep -E "^\s*port" $REDIS_CONFIG_FILE | awk '{print $2}'`
    SOCKET=`grep -E "^\s*unixsocket " $REDIS_CONFIG_FILE | awk '{print $2}'`
    if [ "$PASSWORD" != "" ]; then
        REDIS_CLI_EXTRA_FLAGS="-a $PASSWORD"
    fi
    if [ "$PORT" != "0" ]; then
        REDIS_CLI_EXTRA_FLAGS="$REDIS_CLI_EXTRA_FLAGS -p $PORT"
    else
        REDIS_CLI_EXTRA_FLAGS="$REDIS_CLI_EXTRA_FLAGS -s $SOCKET"
    fi


    if [ `id|sed -e s/uid=//g -e s/\(.*//g` -eq 0 ]; then
        su redis -s /bin/sh -c "$REDIS_CLI $REDIS_CLI_EXTRA_FLAGS SHUTDOWN"
    else
        $REDIS_CLI $REDIS_CLI_EXTRA_FLAGS SHUTDOWN
    fi
    sleep 2
    
    is_redis_running
    RUNNING=$?

    if [ $RUNNING -eq 0 ]; then
	echo "$0 $ARG: $REDIS_NAME stopped"
    else
        echo "$0 $ARG: $REDIS_NAME could not be stopped"
        ERROR=4
    fi
}


cleanpid() {
    rm -f $REDIS_PIDFILE
}

if [ "x$1" = "xstart" ]; then
	start_redis
elif [ "x$1" = "xstop" ]; then
    stop_redis
elif [ "x$1" = "xstatus" ]; then
    is_redis_running
    echo "$REDIS_STATUS"
elif [ "x$1" = "xcleanpid" ]; then
    cleanpid
fi

exit $ERROR

