                    Bitnami Node.js Stack 5.1.0-0
                  ==============================


1. OVERVIEW

The Bitnami Project was created to help spread the adoption of freely
available, high quality, open source web applications. Bitnami aims to make
it easier than ever to discover, download and install open source software
such as document and content management systems, wikis and blogging
software.

You can learn more about Bitnami at https://bitnami.com

Node.js is a platform built on Chrome's JavaScript runtime for easily building 
fast, scalable network applications. Node.js uses an event-driven, non-blocking 
I/O model that makes it lightweight and efficient, perfect for data-intensive 
real-time applications that run across distributed devices.

You can learn more about Node.js at http://nodejs.org/

The Bitnami Node.js Stack is an installer that greatly simplifies the
installation of Node.js and runtime dependencies. Node.js Stack is distributed for free
under the Apache 2.0 license. Please see the appendix for the specific
licenses of all open source components included.

You can learn more about Bitnami Stacks at https://bitnami.com/stacks/

2. FEATURES

- Easy to Install

Bitnami Stacks are built with one goal in mind: to make it as easy as
possible to install open source software. Our installers completely automate
the process of installing and configuring all of the software included in
each Stack, so you can have everything up and running in just a few clicks.

- Independent

Bitnami Stacks are completely self-contained, and therefore do not interfere
with any software already installed on your system. For example, you can
upgrade your system's Apache without fear of 'breaking' your
Bitnami Stack.

- Integrated

By the time you click the 'finish' button on the installer, the whole stack
will be integrated, configured and ready to go. 

- Relocatable

Bitnami Stacks can be installed in any directory. This allows you to have
multiple instances of the same stack, without them interfering with each other. 

3. COMPONENTS

Bitnami Node.js Stack ships with the following software versions:

  - Node.js 5.1.0
  - Apache 2.4.17
  - Python 2.7.10
  - Redis 3.0.5

4. REQUIREMENTS

To install Bitnami Node.js Stack you will need:

    - Intel x86 or compatible processor
    - Minimum of 256 MB RAM 
    - Minimum of 150 MB hard drive space
    - TCP/IP protocol support
    - Compatible operantig systems:
      - An x86 Linux operating system.
      - A 32-bit Windows operating system such as Windows Vista, Windows 7, Windows 8, Windows 10, Windows Server 2008 or Windows Server 2012.
			- An OS X operating system x86.

5. INSTALLATION

The Bitnami Node.js Stack is distributed as a binary executable installer.
It can be downloaded from:

https://bitnami.com/stacks/

The downloaded file will be named something similar to:

bitnami-nodejs-5.1.0-0-linux-installer.run on Linux or
bitnami-nodejs-5.1.0-0-linux-x64-installer.run on Linux 64 bit or
bitnami-nodejs-5.1.0-0-osx-x86-installer.dmg on OS X x86.

On Linux, you will need to give it executable permissions:

chmod 755 bitnami-nodejs-5.1.0-0-linux.run


To begin the installation process, double-click on that file, and you will
be greeted by the 'Welcome' screen. Pressing 'Next' will take you to the
Component Selection screen, where you can select the Redis component, which is a super fast key value database.

The next screen is the Installation Folder, where you can select where Bitnami 
stack will be installed. If the destination directory does not exist, it will 
be created as part of the installation. 

The next screen will vary, depending on whether the ports needed by the bundled Apache and Redis are already taken. The default listening port for Redis is 6379. It it is in use by other application, you will be prompted for an alternate port to use.

Once the information has been entered, the installation will proceed to copy
the files to the target installation directory and configure the different
components. One this process has  been completed, you will see the
'Installation Finished' page. 

If you received an error message during installation, please refer to
the Troubleshooting section.

The rest of this guide assumes that you installed Bitnami Node.js
Stack in /home/user/nodejs-5.1.0-0 on Linuxor /Applications/nodejs-5.1.0-0 on OS X and that you use port 6379 for Redis.

6. STARTING AND STOPPING BITNAMI REDIS STACK

To start/stop/restart the redis server on Linux you can use the included ctlscript.sh
utility, as shown below:

       ./ctlscript.sh (start|stop|restart)
       ./ctlscript.sh (start|stop|restart) redis

  start      - start the service(s)
  stop       - stop  the service(s)
  restart    - restart or start the service(s)

The Bitnami Control Panel is a simple graphical interface included in the OS X stacks that 
can start and stop the Bitnami servers. It is are located in the same installation directory. 
To start the utility, double click the file named 'control' from your file browser.

7. DIRECTORY STRUCTURE

The installation process will create several subfolders under the main
installation directory:

	nodejs/: Node.js Platform
	python/: Python.
	redis/: The advanced key-value store

8. TROUBLESHOOTING

In addition to the resources
provided below, we encourage you to post your questions and suggestions at:

https://community.bitnami.com/

We also encourage you to sign up for our newsletter, which we'll use to
announce new releases and new stacks. To do so, just register at:
https://bitnami.com/newsletter.  

9.1 Installer

# Installer Payload Error 

If you get the following error while trying to run the installer from the
command line:

"Installer payload initialization failed. This is likely due to an
incomplete or corrupt downloaded file" 

The installer binary is not complete, likely because the file was
not downloaded correctly. You will need to download the file and
repeat the installation process. 

9.2 Redis

If you find any problem starting Redis, the first place you should check is
the Apache error log file:

/home/user/nodejs-5.1.0-0/redis/var/log/redis-server.log on Linux or 
/Applications/nodejs-5.1.0-0/var/log/redis-error.log.

Most errors are related to not being able to listen to the default port.
Make sure there are no other server programs listening at the same port
before trying to start Redis. For issues not covered in this Quick Start guide, please refer to
the Redis documentation, which is located at http://redis.io/documentation 

10. LICENSES

Node.js is distributed under the MIT License, which is located at
https://raw.github.com/joyent/node/v0.6.18/LICENSE

Redis is distributed under the BSD License, which is located at:
http://www.opensource.org/licenses/bsd-license.php.

Python is released under the Python License, wich is located at
http://www.python.org/download/releases/2.7.3/license/

npm is released under the MIT License, which is located at:
https://github.com/isaacs/npm/blob/master/LICENSE

Apache Web Server is distributed under the Apache License v2.0, which
is located at http://www.apache.org/licenses/LICENSE-2.0

IMAP is distributed under the University of Washington Free-Fork
License, located at http://www.washington.edu/imap/legal.html

software license, which is located at
http://dev.w3.org/cvsweb/Amaya/libjpeg/README?rev=1.2

libiconv is distributed under the Lesser General Public License
(LGPL), located at http://www.gnu.org/copyleft/lesser.html

OpenSSL is released under the terms of the Apache License, which is
located at http://www.openssl.org/source/license.html

Zlib is released under the zlib License (a free software license/compatible 
with GPL), which is located at http://www.gzip.org/zlib/zlib_license.html

Ncurses is released under the MIT license, which is located at
http://www.opensource.org/licenses/mit-license.php

