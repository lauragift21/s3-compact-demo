const { S3Client, CreateBucketCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`, // Cloudflare R2 endpoint URL
  credentials: {
    accessKeyId: "",
    secretAccessKey: ""
  }
})

const main = async () => {
  console.log(`Hello I'm a S3 Client`);
  const command = new CreateBucketCommand({
    Bucket: 'bucket-name'
  })
  try {
    const { Location } = await s3.send(command);
    console.log(`Bucket created with location ${Location}`)
  } catch (error) {
    console.error(error)
  }
}

module.exports = main();
