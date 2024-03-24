import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const GRAPH_API_TOKEN = process.env.GRAPH_API_TOKEN

const sendMessage = (name) => {
  var options = {
    method: 'POST',
    url: 'https://graph.facebook.com/v17.0/180851955102577/messages',
    headers: {
      Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    data: {
      messaging_product: 'whatsapp',
      to: '919188020170',
      type: 'template',
      template: {
        name: 'alert',
        language: { code: 'en' },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'image',
                image: {
                  link: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfntmfcua0MmAbzlL8XeTZLSg5HGb0SDCzOQ&usqp=CAU',
                },
              },
            ],
          },
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: `${name}`,
              },
              {
                type: 'text',
                text: '15:44 AM',
              },
              {
                type: 'text',
                text: '2023-12-20',
              },
            ],
          },
        ],
      },
    },
  }

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data)
      return true
    })
    .catch(function (error) {
      console.error(error)
      return false
    })
}

export default sendMessage
