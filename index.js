const { S3Client, CreateBucketCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
require('dotenv').config();

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`, // Cloudflare R2 endpoint URL
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  }
});

const createBucket = async (bucketName) => {
  console.log(`Creating bucket ${bucketName}`);

  const command = new CreateBucketCommand({ Bucket: bucketName });
  try {
    const { Location } = await s3.send(command);
    console.log(`Bucket ${bucketName} created with location ${Location}`);
  } catch (error) {
    if (error.name === "BucketAlreadyOwnedByYou") {
      console.log(`Bucket ${bucketName} already exists, skipping...`);
    } else {
      console.error(`Error creating bucket ${bucketName}`, error);
    }
  }
};

const uploadFile = async (bucketName, fileName, fileContent) => {
  console.log(`Uploading file ${fileName} to bucket ${bucketName}`);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent
  });

  try {
    const { ETag } = await s3.send(command);
    console.log(`File ${fileName} uploaded with ETag ${ETag}`);
  } catch (error) {
    console.error(`Error uploading file ${fileName} to bucket ${bucketName}`, error);
  }
};

const main = async () => {
  const bucketName = "s3-demo-bucket";
  await createBucket(bucketName);
  await uploadFile(bucketName, 'demo.txt', 'Hello World');
}

module.exports = {
  createBucket,
  uploadFile
}

if (require.main === module) {
  main().catch(console.error);
}