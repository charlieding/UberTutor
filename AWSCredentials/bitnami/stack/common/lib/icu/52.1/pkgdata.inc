GENCCODE_ASSEMBLY_TYPE=-a gcc
SO=so
SOBJ=so
A=a
LIBPREFIX=lib
LIB_EXT_ORDER=.52.1
COMPILE=gcc -I/bitnami/nodejsstack-linux-x64/output/common/include -I/bitnami/nodejsstack-linux-x64/output/common/include/sasl -I/bitnami/nodejsstack-linux-x64/output/sqlite/include -I/bitnami/nodejsstack-linux-x64/output/common/include -D_REENTRANT  -DU_HAVE_ELF_H=1 -DU_HAVE_ATOMIC=0  -DU_ATTRIBUTE_DEPRECATED= -I/bitnami/nodejsstack-linux-x64/output/common/include -fPIC -m64 -std=c99 -Wall -pedantic -Wshadow -Wpointer-arith -Wmissing-prototypes -Wwrite-strings   -c
LIBFLAGS=-I/bitnami/nodejsstack-linux-x64/output/common/include -DPIC -fPIC
GENLIB=gcc -I/bitnami/nodejsstack-linux-x64/output/common/include -fPIC -m64 -std=c99 -Wall -pedantic -Wshadow -Wpointer-arith -Wmissing-prototypes -Wwrite-strings   -L/bitnami/nodejsstack-linux-x64/output/sqlite/lib -L/bitnami/nodejsstack-linux-x64/output/common/lib  -shared -Wl,-Bsymbolic
LDICUDTFLAGS=-nodefaultlibs -nostdlib
LD_SONAME=-Wl,-soname -Wl,
RPATH_FLAGS=
BIR_LDFLAGS=-Wl,-Bsymbolic
AR=ar
ARFLAGS=r
RANLIB=ranlib
INSTALL_CMD=/usr/bin/install -c
