import { debug, info, warning, error, setFailed } from '@actions/core'
import { context } from '@actions/github'
import * as inputs from './input-parameters'
import * as octopus from './push-build-information'
import { Client, ClientConfiguration, Logger } from '@octopusdeploy/api-client'

async function run(): Promise<void> {
  try {
    const runId = context.runId
    if (runId === undefined) {
      setFailed('GitHub run number is not defined')
      return
    }

    const logger: Logger = {
      debug: message => debug(message),
      info: message => info(message),
      warn: message => warning(message),
      error: (message, err) => {
        if (err !== undefined) {
          error(err.message)
        } else {
          error(message)
        }
      }
    }

    const inputParameters = inputs.get()

    const config: ClientConfiguration = {
      instanceURL: inputParameters.server,
      apiKey: inputParameters.apiKey,
      logging: logger
    }

    const client: Client = await Client.create(config)
    if (client === undefined) throw new Error('Client could not be constructed')

    await octopus.pushBuildInformationFromInputs(client, runId, inputParameters)
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

run()
