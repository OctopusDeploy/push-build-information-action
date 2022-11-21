import { getInput, getMultilineInput } from '@actions/core'
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
  overwriteMode: OverwriteMode
}

export function get(): InputParameters {
  const overwriteMode: OverwriteMode =
    (OverwriteMode as any)[getInput('overwrite_mode')] || // eslint-disable-line @typescript-eslint/no-explicit-any
    OverwriteMode.FailIfExists

  const parameters: InputParameters = {
    server: getInput('server') || process.env[EnvironmentVariables.URL] || '',
    apiKey: getInput('api_key') || process.env[EnvironmentVariables.ApiKey] || '',
    space: getInput('space') || process.env[EnvironmentVariables.Space] || '',
    packages: getMultilineInput('packages', { required: true }),
    version: getInput('version', { required: true }),
    branch: getInput('branch') || undefined,
    overwriteMode
  }

  const errors: string[] = []
  if (!parameters.server) {
    errors.push(
      "The Octopus instance URL is required, please specify explictly through the 'server' input or set the OCTOPUS_URL environment variable."
    )
  }
  if (!parameters.apiKey) {
    errors.push(
      "The Octopus API Key is required, please specify explictly through the 'api_key' input or set the OCTOPUS_API_KEY environment variable."
    )
  }
  if (!parameters.space) {
    errors.push(
      "The Octopus space name is required, please specify explictly through the 'space' input or set the OCTOPUS_SPACE environment variable."
    )
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }

  return parameters
}
