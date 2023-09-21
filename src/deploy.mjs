import aws from 'aws-sdk'
import fs from 'node:fs'

export default async function deploy ({ name, region = 'us-west-2', pathToTemplate }) {
  if (!name) throw Error('missing_name')
  if (!pathToTemplate) throw Error('missing_pathToTemplate')
  let cfn = new aws.CloudFormation({ region })
  let body = fs.readFileSync(pathToTemplate).toString()
  let stack = await exists({ name })
  if (stack) {
    await cfn.updateStack({
      StackName: name,
      TemplateBody: body,
      Capabilities: [ 'CAPABILITY_IAM', 'CAPABILITY_AUTO_EXPAND' ],
    }).promise()

  }
  else {
    await cfn.createStack({
      StackName: name,
      TemplateBody: body,
      Capabilities: [ 'CAPABILITY_IAM', 'CAPABILITY_AUTO_EXPAND' ],
    }).promise()
  }
}

async function exists ({ name }) {
  try {
    let cfn = new aws.CloudFormation
    await cfn.describeStacks({
      StackName: name
    }).promise()
    return true
  }
  catch (err) {
    return false
  }
}
