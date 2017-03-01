# Solidbrain Space Door Opening Service

Main goal of this project is to enable door opening from mobile application to the users. The implementation consists of:

* Raspberry Pi connected to door opening mechanism
* Azure IoT Hub and custom API
* mobile app (as a part of its full functionality)

Mobile app and custom API are not published in this repository.

## RaspberryPi configuration

The main part of RaspberryPi configuration is the node.js script `app.js`. It is responsible for:

* controlling the hardware relay for door opening through GPIO
* registering the device in Azure IoT Hub (connection authenticated with X.509)

`app.js` is run on each machine boot.

## Node script startup configuration

In order to configure the `app.js` script run at the system boot:

1. Place the `dooropening.service` systemd service unit in `/lib/systemd/system/` folder
2. Setup run permissions on file: `sudo chmod 644 /lib/systemd/system/dooropening.service`
3. Configure new systemd service unit:
  * `sudo systemctl daemon-reload`
  * `sudo systemctl enable dooropening.service`
4. Restart RPi: `sudo reboot -n`
5. Check the status of the service after boot: `sudo systemctl status dooropening.service`

The successful status should look as follow:

```
* dooropening.service - Establish connection with Azure IoT Hub for door opening service
   Loaded: loaded (/lib/systemd/system/dooropening.service; enabled)
   Active: active (running) since Tue 2017-02-28 10:08:08 UTC; 49s ago
 Main PID: 508 (node)
   CGroup: /system.slice/dooropening.service
           └─508 /usr/bin/node /home/pi/.../app.js > /home/pi/solidbrain-space-intercom.log 2>&1

Feb 28 10:08:08 raspberrypi systemd[1]: Starting Establish connection with Azure IoT Hub for door opening service...
Feb 28 10:08:08 raspberrypi systemd[1]: Started Establish connection with Azure IoT Hub for door opening service.
Feb 28 10:08:21 raspberrypi node[508]: [Device (intercom-rpi)] Using X.509 client certificate authentication.
Feb 28 10:08:23 raspberrypi node[508]: [Device (intercom-rpi)] Client connected.
```

The status check command (step 5) can be used for diagnostics:

```
Mar 01 09:38:58 raspberrypi node[513]: [Device (intercom-rpi)] Using X.509 client certificate authentication.
Mar 01 09:39:06 raspberrypi node[513]: [Device (intercom-rpi)] Client connected.
Mar 01 09:42:14 raspberrypi node[513]: Open Door command has been invoked.
Mar 01 09:42:24 raspberrypi node[513]: Open Door command has been invoked.
Mar 01 09:42:30 raspberrypi node[513]: Open Door command has been invoked.
Mar 01 09:42:35 raspberrypi node[513]: Open Door command has been invoked.
```

For more information about `systemd` read [this site](https://www.freedesktop.org/software/systemd/man/systemd.service.html).