import aws from 'aws-sdk'

/** check if a file exists in s3 already */
export default async function exists ({ bucket, key, region = 'us-west-2' }) {
  try {
    let s3 = new aws.S3({ region })
    await s3.headObject({
      Bucket: bucket,
      Key: key
    }).promise()
    return true
  }
  catch (err) {
    return false
  }
}
