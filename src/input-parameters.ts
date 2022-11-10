import { getBooleanInput, getInput, getMultilineInput } from '@actions/core'
import { OverwriteMode } from '@octopusdeploy/api-client'

const EnvironmentVariables = {
  URL: 'OCTOPUS_URL',
  ApiKey: 'OCTOPUS_API_KEY',
  Space: 'OCTOPUS_SPACE'
} as const

export interface InputParameters {
  // Optional: A server is required, but you should use the OCTOPUS_URL env
  server: string
  // Optional: An API key is required, but you should use the OCTOPUS_API_KEY environment variable instead of this.
  apiKey: string
  // Optional: You should prefer the OCTOPUS_SPACE environment variable
  space: string
  packages: string[]
  version: string
  branch?: string
  debug?: boolean
  overwriteMode: OverwriteMode
}

export function get(): InputParameters {
  const overwriteMode: OverwriteMode =
    (OverwriteMode as any)[getInput('overwrite_mode')] || // eslint-disable-line @typescript-eslint/no-explicit-any
    OverwriteMode.FailIfExists
  return {
    server: getInput('server') || process.env[EnvironmentVariables.URL] || '',
    apiKey: getInput('api_key') || process.env[EnvironmentVariables.ApiKey] || '',
    space: getInput('space') || process.env[EnvironmentVariables.Space] || '',
    packages: getMultilineInput('packages', { required: true }),
    version: getInput('version', { required: true }),
    branch: getInput('branch'),
    debug: getBooleanInput('debug'),
    overwriteMode
  }
}
