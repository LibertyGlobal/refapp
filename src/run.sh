#!/bin/sh
#
# If not stated otherwise in this file or this component's LICENSE file the
# following copyright and licenses apply:
#
# Operator reference application
#
# Copyright (C) 2018-2019 Liberty Global B.V.
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; version 2 of the License.
#

SCRIPT=${1:-$(/usr/bin/dirname "$0")/main.js}
SCRIPT_ROOT=$(/usr/bin/dirname "${SCRIPT}")

export DBUS_SESSION_BUS_ADDRESS=unix:path=/var/run/dbus/system_bus_socket

export ECORE_EVAS_ENGINE=wayland_egl
export EVAS_GL_API_DEBUG=1
export EVAS_GL_INFO=1
export EVAS_GL_GET_PROGRAM_BINARY=0
export ELM_ENGINE=wayland_egl
export ELM_ACCEL=opengl
export XDG_DATA_DIRS=/usr/share/xkb/
export XDG_RUNTIME_DIR=/var/run/weston
export EGL_PLATFORM=wayland

WESTON_EXPORTS_FILE="/usr/bin/weston.exports.inc" #ONEM-1712
xdg_config_home=$(/bin/cat $WESTON_EXPORTS_FILE | /bin/grep XDG_CONFIG_HOME)
${xdg_config_home}

#####################
#DISABLING CORE DUMPS
#####################
ulimit -c 0
# echo /home/core > /proc/sys/kernel/core_pattern

_LD_PRELOAD=${LD_PRELOAD}:/usr/lib/libnexus.so:/usr/lib/libnxpl-weston.so.1.13.1:/usr/lib/libwayland-nxclient.so.0:/usr/lib/libwayland-egl.so.1:/usr/lib/libGLESv2.so:/usr/lib/libIARMBus.so.0:/usr/lib/libdshalcli.so:/usr/lib/libds.so
EXE=/usr/bin/node

cd "${SCRIPT_ROOT}"
export LD_LIBRARY_PATH=/usr/lib:/usr/lib/weston
export WAYLAND_DISPLAY="wayland-0"
export NODE_PATH="/usr/lib/node_modules/:${SCRIPT_ROOT}"

LD_PRELOAD=${_LD_PRELOAD} EINA_LOG_LEVEL="${EINA_LOG_LEVEL}" ${EXE} --expose-gc --inspect --debug --nolazy "${SCRIPT}"
