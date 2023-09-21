import aws from 'aws-sdk'

export default async function deploy ({name}) {
  // see if the stack exists
  // if it does update it
  // if it does not create it
   
}

async function exists ({name}) {
  try {
    let cfn = new aws.CloudFormation
    await cfn.describeStacks({
      StackName: name
    }).promise()
    return true
  }
  catch () {
    return false
  }
}
