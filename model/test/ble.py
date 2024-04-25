from flask import Flask, request, jsonify
from flask_cors import CORS
from bleak import BleakClient, BleakError

# Define the BLE device address and the UUIDs for service and characteristic
DEVICE_ADDRESS = "E0:F7:BF:E9:2B:7C"
SERVICE_UUID = "12345678-1234-5678-9abc-def012345678"
CHARACTERISTIC_UUID = "12345678-1234-5678-9abc-def012345679"

# Create a Flask application
app = Flask(__name__)

# Enable CORS for all routes in the application
CORS(app)

# Function to send the authentication key using BleakClient
async def send_authentication_key(address, auth_key):
    try:
        async with BleakClient(address) as client:
            if not await client.is_connected():
                await client.connect()
                print("Connected to the Arduino Nano BLE Sense Lite.")
            else:
                print("Already connected to the Arduino Nano BLE Sense Lite.")

            # Send the authentication key to the characteristic
            await client.write_gatt_char(CHARACTERISTIC_UUID, auth_key.encode())
            print(f"Sent authentication key '{auth_key}' to the Arduino Nano BLE Sense Lite.")
        
        return True
    
    except BleakError as e:
        print(f"Error during BLE communication: {str(e)}")
        return False

# Define a POST endpoint at /privkey
@app.route('/privkey', methods=['POST'])
async def privkey():
    try:
        # Parse the JSON data from the request body
        data = request.get_json()
        priv_key = data.get('privKey')

        # Check if privKey is provided
        if not priv_key:
            return jsonify({'error': 'Missing privKey in request body'}), 400

        print(f"Received private key '{priv_key}' from the client.")
        
        # Send the authentication key using the send_authentication_key function
        success = await send_authentication_key(DEVICE_ADDRESS, priv_key)

        if success:
            return jsonify({'message': f'Successfully sent authentication key to the Arduino Nano BLE Sense Lite'}), 200
        else:
            return jsonify({'error': 'Failed to send authentication key to the Arduino Nano BLE Sense Lite'}), 500

    except Exception as e:
        # Handle any unexpected errors
        print(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True, port=8000)