import { getInput, getMultilineInput } from '@actions/core'
import { OverwriteMode } from '@octopusdeploy/api-client'

const EnvironmentVariables = {
  URL: 'OCTOPUS_URL',
  ApiKey: 'OCTOPUS_API_KEY',
  AccessToken: 'OCTOPUS_ACCESS_TOKEN',
  Space: 'OCTOPUS_SPACE'
} as const

export interface InputParameters {
  // Optional: A server is required, but you should use the OCTOPUS_URL env
  server: string
  // Optional: One of API key or Access token is required, but you should use the OCTOPUS_API_KEY environment variable instead of this.
  apiKey?: string
  // Optional: Access token can only be obtained from the OCTOPUS_ACCESS_TOKEN environment variable.
  accessToken?: string
  // Optional: You should prefer the OCTOPUS_SPACE environment variable
  space: string
  packages: string[]
  version: string
  branch?: string
  overwriteMode: OverwriteMode
}

export function get(isRetry: boolean): InputParameters {
  const overwriteMode: OverwriteMode =
    (OverwriteMode as any)[getInput('overwrite_mode')] || // eslint-disable-line @typescript-eslint/no-explicit-any
    (isRetry ? OverwriteMode.IgnoreIfExists : OverwriteMode.FailIfExists)

  const parameters: InputParameters = {
    server: getInput('server') || process.env[EnvironmentVariables.URL] || '',
    apiKey: getInput('api_key') || process.env[EnvironmentVariables.ApiKey],
    accessToken: process.env[EnvironmentVariables.AccessToken],
    space: getInput('space') || process.env[EnvironmentVariables.Space] || '',
    packages: getMultilineInput('packages', { required: true }),
    version: getInput('version', { required: true }),
    branch: getInput('branch') || undefined,
    overwriteMode
  }

  const errors: string[] = []
  if (!parameters.server) {
    errors.push(
      "The Octopus instance URL is required, please specify explicitly through the 'server' input or set the OCTOPUS_URL environment variable."
    )
  }

  if (!parameters.apiKey && !parameters.accessToken) {
    errors.push(
      "The Octopus API Key is required, please specify explicitly through the 'api_key' input or set the OCTOPUS_API_KEY environment variable."
    )
  }

  if (!parameters.space) {
    errors.push(
      "The Octopus space name is required, please specify explicitly through the 'space' input or set the OCTOPUS_SPACE environment variable."
    )
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }

  return parameters
}
