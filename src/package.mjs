import fs from 'fs'
import yaml from 'js-yaml'
import upload from './upload.mjs'

// used to walk the resources, maybe uploading code, and then rewriting the template w S3 paths
export default async function pkg ({pathToTemplate, bucket}) {

  // read the Architect generated sam.json file
  let template = JSON.parse(fs.readFileSync(pathToTemplate).toString())

  // walk the resources looking for Lambda functions
  for (let name of Object.keys(template.Resources)) {

    let type = template.Resources[name].Type
    let prop = false

    if (type === 'AWS::Serverless::Function') {
      prop = 'CodeUri'
    }

    if (type === 'AWS::Lambda::Function') {
      prop = 'Code'
    }

    if (prop) {
      let folder = template.Resources[name].Properties[prop]
      let key = await upload({bucket, folder})
      template.Resources[name].Properties[prop] = `s3://${bucket}/${key}` 
    }
  }

  // re-serialize template to sam.yaml file
  let pathToYaml = pathToTemplate.replace('sam.json', 'sam.yaml')
  fs.writeFileSync(pathToYaml, yaml.dump(template))
}
