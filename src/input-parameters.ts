import {getBooleanInput, getMultilineInput, getInput} from '@actions/core'

export interface InputParameters {
  branch?: string
  debug?: boolean
  overwriteMode: string
  packages: string[]
  space: string
  version: string
}

export function get(): InputParameters {
  return {
    branch: getInput('branch'),
    debug: getBooleanInput('debug'),
    overwriteMode: getInput('overwrite_mode'),
    packages: getMultilineInput('packages', {required: true}),
    space: getInput('space'),
    version: getInput('version', {required: true})
  }
}
