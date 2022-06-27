import {setFailed} from '@actions/core'
import {context} from '@actions/github'
import * as inputs from './input-parameters'
import * as octopus from './push-build-information'

async function run(): Promise<void> {
  try {
    const runId = context.runId
    if (runId === undefined) {
      setFailed('GitHub run number is not defined')
      return
    }

    const inputParameters = inputs.get()
    await octopus.pushBuildInformation(runId, inputParameters)
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

run()
