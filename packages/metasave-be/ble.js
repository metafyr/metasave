import {createBluetooth} from 'node-ble'

const { bluetooth, destroy } = createBluetooth()
const adapter = await bluetooth.defaultAdapter()

if (! await adapter.isDiscovering())
    await adapter.startDiscovery()
    const device = await adapter.waitDevice('E0:F7:BF:E9:2B:7C')
    await device.connect()
    const gattServer = await device.gatt()
    const service1 = await gattServer.getPrimaryService('12345678-1234-5678-9abc-def012345678')
    const characteristic1 = await service1.getCharacteristic('12345678-1234-5678-9abc-def012345679')
    await characteristic1.writeValue(Buffer.from(privKey))
    const buffer = await characteristic1.readValue()