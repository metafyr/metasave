import asyncio
from bleak import BleakClient

address = "E0:F7:BF:E9:2B:7C"
SERVICE_UUID = "12345678-1234-5678-9abc-def012345678"
CHAR_UUID = "12345678-1234-5678-9abc-def012345679"

async def read_characteristics(address):
    async with BleakClient(address) as client:
        incrementing_number = 0
        while True:
            try:
                char_value = await client.read_gatt_char(CHAR_UUID)
                int_value = int(char_value[0])
                print(f"{incrementing_number}: {int_value}")
                incrementing_number += 1
            except Exception as e:
                print(f"Error: {e}")
                break

asyncio.run(read_characteristics(address))
