const gpio = require('pi-gpio');

const gpioPin = 11;  

let isOpened = false; 
 
let unlockRelay = function() { 
  if (!isOpened) {
    gpio.open(gpioPin, "output")

    /* Open the door lock */
    gpio.write(gpioPin, 0, () => { isOpened = true })

    /*setTimeOut will be activated in 2 seconds, closing the lock as we set gpioPin value to 0*/
    setTimeout(() => {
      gpio.write(gpioPin, 1, () => {
        isOpened = false
        gpio.close(gpioPin)
      });
    }, 500)
  }  
}

module.exports.unlockRelay = unlockRelay;
