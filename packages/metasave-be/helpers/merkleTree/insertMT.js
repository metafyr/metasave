async function insertMT(data){
    try{
        const response = await axios.post(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            data,
            {
              headers: {
                Authorization: `Bearer ${PINATA_API_KEY}`,
              },
            }
          )
        dataIPFSid = response.data.IpfsHash
        return dataIPFSid
    }catch(error){
        console.log(error)
    }
}

export default insertMT