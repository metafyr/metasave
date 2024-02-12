import sendMessage from "../../helpers/whatsapp/sendMessage"

const whatsappNotification = async(req, res) => {
    try {
        const CFAddress = req.body.CFAddress
        let phoneNumbers = []
        // fetch file name from IPFS
        //fetch userDetails from Blockchain
        //loop through phone numbers and send message
        for (let i = 0; i < phoneNumbers.length; i++) {
            const res = sendMessage(phoneNumbers[i])
            if(!res){
                console.log('Error sending message to', phoneNumbers[i])
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export default whatsappNotification