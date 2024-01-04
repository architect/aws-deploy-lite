import aws from 'aws-sdk'
import path from 'node:path'
import test from 'node:test'
import fs from 'node:fs'
import assert from 'node:assert'

import pkg from '../src/package.mjs'
import deploy from '../src/deploy.mjs'

const Bucket = 'aws-deploy-lite-test-deploys'
const base = path.join(process.cwd(), 'test', 'mock-deploy')
const pathToTemplate = path.join(base, 'sam.json')

const sam = {
  'AWSTemplateFormatVersion': '2010-09-09',
  'Transform': 'AWS::Serverless-2016-10-31',
  'Resources': {
    'MyFun': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'Runtime': 'nodejs16.x',
        'CodeUri': path.join(base, 'fun')
      }
    }
  }
}

const index = `export async function handler (event, context) {
  return 'hello world'
}`

test('can package a sam.json document', async () => {

  // create mock-package
  fs.mkdirSync(base)

  // create mock-package/sam.json
  fs.writeFileSync(pathToTemplate, JSON.stringify(sam))

  // create mock-package/fun/index.mjs
  fs.mkdirSync(path.join(base, 'fun'))
  fs.writeFileSync(path.join(base, 'fun', 'index.mjs'), index)

  // create a bucket
  let s3 = new aws.S3({ region: 'us-west-2' })
  try {
    await s3.createBucket({ Bucket }).promise()
  } catch(e) {}

  // create mock-package/sam.yaml
  await pkg({ pathToTemplate, bucket: Bucket })

  // verify sam.yaml exists
  const pathToYaml = pathToTemplate.replace('sam.json', 'sam.yaml')
  assert.ok(fs.existsSync(pathToYaml), 'created sam.yaml')

  // create the stack!
  await deploy({ name: 'teststack', pathToTemplate: pathToYaml })

  // get the CodeUri value
  // const contents = fs.readFileSync(pathToYaml).toString()
  // const parsed = yaml.load(contents)
  // const uri = parsed.Resources.MyFun.Properties.CodeUri.startsWith('s3://')
  // assert.ok(uri, 'CodeUri is s3://')

  // verify the CodeUri exists in S3
  // const Key = uri.replace(`s3://${Bucket}/`, '').split('/').shift()
  // assert.ok(await exists({ Bucket, Key }), 'code uploaded to s3')

  // delete the file
  // await s3.deleteObject({ Bucket, Key }).promise()

  // delete the bucket
  // await s3.deleteBucket({ Bucket }).promise()

  // final cleanup by deleting mock-pkg
  fs.rmSync(base, { recursive: true, force: true })
})
