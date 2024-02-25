import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import * as AWS_S3 from '@aws-sdk/client-s3'
import fs from 'fs'

const client = new AWS_S3.S3({
  region: process.env.AWS_REGION
})

// Uploads a file to an S3 bucket
export const uploadFile = (file: any, bucket: string): any => {
  const s3Params: AWS_S3.PutObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${bucket}/${file.filename}`,
    Body: fs.createReadStream(file.path)
  }

  const upload = client
    .send(new AWS_S3.PutObjectCommand(s3Params))
    .then((data: any) => {
      fs.unlinkSync(file.path)
      return data
    })
    .catch((err: any) => {
      console.log(err)
    })
  return upload
}


export const getUrl = async (file: any, bucket: string) => {
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${bucket}/${file}`
  }
  return await getSignedUrl(client, new AWS_S3.GetObjectCommand(s3Params), {
    expiresIn: 3600
  })
}

// Deletes an object
export const deleteObject = (key: string, bucket: string): Promise<AWS_S3.DeleteObjectCommandOutput> => {
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${bucket}/${key}`
  }

  return new Promise((resolve, reject) => {
    client.deleteObject(s3Params, (err: any, data: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const getObject = async (key: string, bucket: string) => {
  const s3Params = new AWS_S3.GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${bucket}/${key}`
  })

  try {
    const response = await client.send(s3Params)
    return response
  } catch (error) {
    console.log(error)
  }
}
