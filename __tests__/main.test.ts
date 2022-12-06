import { context } from '@actions/github'
import { Client, ClientConfiguration, Logger } from '@octopusdeploy/api-client'
import * as inputs from '../src/input-parameters'
import * as octopus from '../src/push-build-information'
import { CaptureOutput } from './test-helpers'

const apiClientConfig: ClientConfiguration = {
  userAgentApp: 'Test',
  apiKey: process.env.OCTOPUS_TEST_API_KEY || 'API-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  instanceURL: process.env.OCTOPUS_TEST_URL || 'http://localhost:8050'
}

describe('inputs', () => {
  it('successfully get input parameters', async () => {
    const inputParameters = inputs.get(false)
    expect(inputParameters != undefined)
  }, 100000)
})

describe('build information', () => {
  it('successfully pushes build information', async () => {
    const output = new CaptureOutput()

    const logger: Logger = {
      debug: message => output.debug(message),
      info: message => output.info(message),
      warn: message => output.warn(message),
      error: (message, err) => {
        if (err !== undefined) {
          output.error(err.message)
        } else {
          output.error(message)
        }
      }
    }

    const config: ClientConfiguration = {
      userAgentApp: 'Test',
      instanceURL: apiClientConfig.instanceURL,
      apiKey: apiClientConfig.apiKey,
      logging: logger
    }

    const client = await Client.create(config)

    const inputParameters = inputs.get(false)
    const runId = context.runId
    if (runId === undefined) {
      throw new Error('GitHub run number is not defined')
    }
    await octopus.pushBuildInformationFromInputs(client, runId, inputParameters)
  }, 100000)
})
