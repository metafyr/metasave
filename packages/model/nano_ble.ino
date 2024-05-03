#include <ArduinoBLE.h>
#include <Arduino_LSM9DS1.h>

BLEService customService("12345678-1234-5678-9abc-def012345678"); 

BLEIntCharacteristic Characteristic("12345678-1234-5678-9abc-def012345679", BLERead | BLENotify);

void setup() {
  Serial.begin(9600);
  Serial.println("Started");

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  }

  BLE.begin();

  BLE.setLocalName("BLE");
  BLE.setAdvertisedService(customService);

  customService.addCharacteristic(Characteristic);
  
  BLE.addService(customService);

  Characteristic.writeValue(0);

  BLE.advertise();

  Serial.println("BLE LED Peripheral");
  
}

void loop() {
   
  BLE.poll();
    
  float x, y, z;

  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);

    Serial.print(x);
    Serial.print('\t');
    Serial.print(y);
    Serial.print('\t');
    Serial.println(z);

    if ((abs(x)>=3.99 and abs(y)>=3.99) || (abs(y)>=3.99 and abs(z)>=3.99) || (abs(z)>=3.99 and abs(x) >=3.99)) {
      Characteristic.writeValue(1);
    } else {
      Characteristic.writeValue(0);
    }
        
  }
}
