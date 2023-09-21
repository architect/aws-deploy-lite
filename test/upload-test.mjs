import aws from 'aws-sdk'
import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert'
import upload from '../src/upload.mjs'

const Bucket = 'aws-deploy-lite-test-upload'

test('can upload a file', async () => {

  // create a bucket
  let s3 = new aws.S3
  await s3.createBucket({ Bucket }).promise()

  // upload a file
  let folder = path.join(process.cwd(), 'test', 'mock')
  let Key = await upload({ bucket: Bucket, folder })

  // check the file is there
  let objs = await s3.listObjectsV2({ Bucket }).promise()
  assert.strictEqual(objs.Contents.length, 1)

  // delete the file
  await s3.deleteObject({ Bucket, Key }).promise()

  // delete the bucket
  await s3.deleteBucket({ Bucket }).promise()
})
