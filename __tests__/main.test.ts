import { context } from '@actions/github'
import * as inputs from '../src/input-parameters'
import * as octopus from '../src/push-build-information'

describe('inputs', () => {
  it('successfully get input parameters', async () => {
    const inputParameters = inputs.get()
    expect(inputParameters != undefined)
  }, 100000)
})

describe('build information', () => {
  it('successfully pushes build information', async () => {
    const inputParameters = inputs.get()
    const runId = context.runId
    if (runId === undefined) {
      throw new Error('GitHub run number is not defined')
    }
    await octopus.pushBuildInformation(runId, inputParameters)
  }, 100000)
})
