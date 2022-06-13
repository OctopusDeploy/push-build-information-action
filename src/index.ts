import {setFailed} from '@actions/core'
import * as octopus from './push-build-information'
import * as inputs from './input-parameters'

async function run(): Promise<void> {
  try {
    const runId = process.env.GITHUB_RUN_ID
    const inputParameters = inputs.get()
    await octopus.pushBuildInformation(runId, inputParameters)
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

run()
