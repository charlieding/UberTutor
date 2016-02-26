#!/bin/sh
echo $LD_LIBRARY_PATH | egrep "/opt/bitnami/common" > /dev/null
if [ $? -ne 0 ] ; then
PATH="/opt/bitnami/redis/bin:/opt/bitnami/python/bin:/opt/bitnami/nodejs/bin:/opt/bitnami/git/bin:/opt/bitnami/apache2/bin:/opt/bitnami/common/bin:$PATH"
export PATH
LD_LIBRARY_PATH="/opt/bitnami/redis/lib:/opt/bitnami/python/lib:/opt/bitnami/git/lib:/opt/bitnami/apache2/lib:/opt/bitnami/common/lib:$LD_LIBRARY_PATH"
export LD_LIBRARY_PATH
fi

TERMINFO=/opt/bitnami/common/share/terminfo
export TERMINFO
##### REDIS ENV #####
		
      ##### NODEJS ENV #####

export NODE_PATH=/opt/bitnami/nodejs/lib/node_modules

            ##### IMAGEMAGICK ENV #####
MAGICK_HOME="/opt/bitnami/common"
export MAGICK_HOME

MAGICK_CONFIGURE_PATH="/opt/bitnami/common/lib/ImageMagick-6.7.5/config:/opt/bitnami/common/"
export MAGICK_CONFIGURE_PATH

MAGICK_CODER_MODULE_PATH="/opt/bitnami/common/lib/ImageMagick-6.7.5/modules-Q16/coders"
export MAGICK_CODER_MODULE_PATH
##### GIT ENV #####
GIT_EXEC_PATH=/opt/bitnami/git/libexec/git-core/
export GIT_EXEC_PATH
GIT_TEMPLATE_DIR=/opt/bitnami/git/share/git-core/templates
export GIT_TEMPLATE_DIR
GIT_SSL_CAINFO=/opt/bitnami/common/openssl/certs/curl-ca-bundle.crt
export GIT_SSL_CAINFO

SASL_CONF_PATH=/opt/bitnami/common/etc
export SASL_CONF_PATH
SASL_PATH=/opt/bitnami/common/lib/sasl2 
export SASL_PATH
LDAPCONF=/opt/bitnami/common/etc/openldap/ldap.conf
export LDAPCONF
##### APACHE ENV #####

##### CURL ENV #####
CURL_CA_BUNDLE=/opt/bitnami/common/openssl/certs/curl-ca-bundle.crt
export CURL_CA_BUNDLE
##### SSL ENV #####
SSL_CERT_FILE=/opt/bitnami/common/openssl/certs/curl-ca-bundle.crt
export SSL_CERT_FILE
OPENSSL_CONF=/opt/bitnami/common/openssl/openssl.cnf
export OPENSSL_CONF
OPENSSL_ENGINES=/opt/bitnami/common/lib/engines
export OPENSSL_ENGINES


. /opt/bitnami/scripts/build-setenv.sh
PYTHONHOME=/opt/bitnami/python
export PYTHONHOME

