import * as inputs from '../src/input-parameters'
import * as octopus from '../src/push-build-information'

describe('inputs', () => {
  it('successfully get input parameters', async () => {
    const inputParameters = inputs.get()
    expect(inputParameters != undefined)
  }, 100000)
})

describe('build-infos', () => {
  it('successfully pushes build information', async () => {
    const inputParameters = inputs.get()
    octopus.pushBuildInformation("1", inputParameters)
  }, 100000)
})
