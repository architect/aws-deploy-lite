import aws from 'aws-sdk'
import crypto from 'crypto'
import zip from 'zip-dir'
import exists from './exists.mjs'

/** upload a file to an s3 bucket using content aware hash for key */
export default async function upload ({ bucket, folder, region = 'us-west-2' }) {

  let body = await zip(folder)
  let key = crypto.createHash('sha256').update(body).digest('base64')

  // only upload if the file isn't already there
  let uploaded = await exists({ bucket, key })
  if (!uploaded) {
    let s3 = new aws.S3
    await s3.upload({
      Bucket: bucket,
      Key: key,
      Body: body,
      region,
    }).promise()
  }

  return key
}
