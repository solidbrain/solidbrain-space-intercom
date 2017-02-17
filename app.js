const fs = require('fs')
const path = require('path')

const Client = require('azure-iot-device').Client
const ConnectionString = require('azure-iot-device').ConnectionString
const Protocol = require('azure-iot-device-mqtt').Mqtt

const config = require('./config.json')
const GPIOCtrl = require('./gpio-ctrl')
const connectionString = ConnectionString.parse(config.device_connection_string)
const deviceId = connectionString.DeviceId
const client = Client.fromConnectionString(config.device_connection_string, Protocol)

if (connectionString.x509) {
  const x509Path = path.join(__dirname, 'device-x509')

  const options = {
    cert: fs.readFileSync(path.join(x509Path, deviceId + '-cert.pem')).toString(),
    key: fs.readFileSync(path.join(x509Path, deviceId + '-key.pem')).toString()
  }

  client.setOptions(options)

  console.log('[Device (' + deviceId + ')] Using X.509 client certificate authentication.')
}

function onOpenDoorCommand() {
  console.log('Open Door command has been invoked.')

  GPIOCtrl.unlockRelay()
}

client.open(err => {
  if (err) {
    console.error('[Device (' + deviceId + ')] Could not connect: ' + err)
  } else {
    console.log('[Device (' + deviceId + ')] Client connected.')
    
    client.onDeviceMethod('open-door', onOpenDoorCommand) 
 }
})
