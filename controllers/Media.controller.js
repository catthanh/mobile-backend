const AWS = require('aws-sdk')

const s3 = new AWS.S3()
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})  

require("dotenv").config();


module.exports = {
    getPresignedUrl: async (req, res, next) => {
        const myBucket = 'son-mobile-images'
        const myKey = 'test.jpg'
        const signedUrlExpireSeconds = 60 * 5

        const url = s3.getSignedUrl('putObject', {
            Bucket: myBucket,
            'ContentType': 'image/*',
            ContentDisposition: "inline",
            Key: myKey,
            Expires: signedUrlExpireSeconds
        })

        console.log(url);

        res.sendStatus(200);
    }
}