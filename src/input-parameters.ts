import {getBooleanInput, getMultilineInput, getInput} from '@actions/core'

export interface InputParameters {
  debug: boolean
  overwriteMode: string
  packages: string[]
  space: string
  version: string
}

export function get(): InputParameters {
  return {
    debug: getBooleanInput('debug'),
    overwriteMode: getInput('overwrite_mode'),
    packages: getMultilineInput('packages'),
    space: getInput('space'),
    version: getInput('version')
  }
}
