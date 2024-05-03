import asyncio
from bleak import BleakClient
import struct

address = "E0:F7:BF:E9:2B:7C"
SERVICE_UUID = "12345678-1234-5678-9abc-def012345678"
CHAR_X_UUID = "12345678-1234-5678-9abc-def012345679"
CHAR_Y_UUID = "12345678-1234-5678-9abc-def01234567a"
CHAR_Z_UUID = "12345678-1234-5678-9abc-def01234567b"

def convert_bytes_to_int(values):
    return [struct.unpack('<i', bytes(values[0]))[0]/100, struct.unpack('<i', bytes(values[1]))[0]/100, struct.unpack('<i', bytes(values[2]))[0]/100]

async def read_characteristic(client, char_uuid):
    char_value = await client.read_gatt_char(char_uuid)
    return char_value

async def read_characteristics(address):
    async with BleakClient(address) as client:
        while True:
            try:

                char_values = await asyncio.gather(
                    read_characteristic(client, CHAR_X_UUID),
                    read_characteristic(client, CHAR_Y_UUID),
                    read_characteristic(client, CHAR_Z_UUID)
                )
                print(convert_bytes_to_int(char_values))
                
            except Exception as e:
                print(f"Error: {e}")
                break

asyncio.run(read_characteristics(address))
