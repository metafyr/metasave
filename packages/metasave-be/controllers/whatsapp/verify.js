import dotenv from 'dotenv'

dotenv.config()

const whatsappVerify = (req, res) => {
    try{
      const verify_token = process.env.VERIFY_TOKEN;
      let mode = req.query["hub.mode"];
      let token = req.query["hub.verify_token"];
      let challenge = req.query["hub.challenge"];
      if (mode && token) {
        if (mode === "subscribe" && token === verify_token) {
          console.log("WEBHOOK_VERIFIED");
          res.status(200).send(challenge);
        } else {
          res.sendStatus(403);
        }
      }
    } catch (err) {
      throw err;
    }
}

export default whatsappVerify