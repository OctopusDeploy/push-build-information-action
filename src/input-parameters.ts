import {getBooleanInput, getInput, getMultilineInput} from '@actions/core'
import {OverwriteMode} from '@octopusdeploy/api-client'

export interface InputParameters {
  branch?: string
  debug?: boolean
  overwriteMode: OverwriteMode
  packages: string[]
  version: string
}

export function get(): InputParameters {
  const overwriteMode: OverwriteMode =
    (OverwriteMode as any)[getInput('overwrite_mode')] || // eslint-disable-line @typescript-eslint/no-explicit-any
    OverwriteMode.FailIfExists
  return {
    branch: getInput('branch'),
    debug: getBooleanInput('debug'),
    overwriteMode,
    packages: getMultilineInput('packages', {required: true}),
    version: getInput('version', {required: true})
  }
}
