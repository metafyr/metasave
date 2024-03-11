#include <ArduinoBLE.h>
#include <Arduino_LSM9DS1.h>

BLEService customService("12345678-1234-5678-9abc-def012345678"); 

BLEIntCharacteristic CharacteristicX("12345678-1234-5678-9abc-def012345679", BLERead | BLENotify);
BLEIntCharacteristic CharacteristicY("12345678-1234-5678-9abc-def01234567a", BLERead | BLENotify);
BLEIntCharacteristic CharacteristicZ("12345678-1234-5678-9abc-def01234567b", BLERead | BLENotify);

void setup() {
  Serial.begin(9600);
  Serial.println("Started");

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  }

  Serial.print("Accelerometer sample rate = ");
  Serial.print(IMU.accelerationSampleRate());
  Serial.println(" Hz");
  Serial.println();
  Serial.println("Acceleration in G's");
  Serial.println("X\tY\tZ");

  BLE.begin();

  BLE.setLocalName("BLE");
  BLE.setAdvertisedService(customService);

  customService.addCharacteristic(CharacteristicX);
  customService.addCharacteristic(CharacteristicY);
  customService.addCharacteristic(CharacteristicZ);

  BLE.addService(customService);

  CharacteristicX.writeValue(0);
  CharacteristicY.writeValue(0);
  CharacteristicZ.writeValue(0);

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

    CharacteristicX.writeValue(x*100);
    CharacteristicY.writeValue(y*100);
    CharacteristicZ.writeValue(z*100);
        
  }
}