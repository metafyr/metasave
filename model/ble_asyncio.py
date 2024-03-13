import asyncio
from bleak import BleakClient
import struct

address = "E0:F7:BF:E9:2B:7C"
SERVICE_UUID = "12345678-1234-5678-9abc-def012345678"
CHAR_X_UUID = "12345678-1234-5678-9abc-def012345679"
CHAR_Y_UUID = "12345678-1234-5678-9abc-def01234567a"
CHAR_Z_UUID = "12345678-1234-5678-9abc-def01234567b"

def convert_bytes_to_int(values):
    return [struct.unpack('<i', values[0])[0]/100, struct.unpack('<i', values[1])[0]/100, struct.unpack('<i', values[2])[0]/100]

async def read_characteristics(address):
    async with BleakClient(address) as client:
        while True:
            try:
                char_x_value = await client.read_gatt_char(CHAR_X_UUID)
                char_y_value = await client.read_gatt_char(CHAR_Y_UUID)
                char_z_value = await client.read_gatt_char(CHAR_Z_UUID)
                char_values = [char_x_value, char_y_value, char_z_value]
                print(convert_bytes_to_int(char_values))
            except Exception as e:
                print(f"Error: {e}")
                break

asyncio.run(read_characteristics(address))
