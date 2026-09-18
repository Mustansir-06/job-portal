const ImageKit = require('@imagekit/nodejs');
const config = require('../config/config');

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

const uploadFile=async(buffer)=>{
    const response = await client.files.upload({
    file: buffer.toString("base64"),
    fileName: 'resume.jpg'
    });

    return response;
}
module.exports=uploadFile