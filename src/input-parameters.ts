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
  // Optional: One of API key or Access token is required, but you should use the OCTOPUS_ACCESS_TOKEN environment variable instead of this.
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
    accessToken: getInput('access_token') || process.env[EnvironmentVariables.AccessToken],
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

  if (!parameters.apiKey && !parameters.accessToken)
    errors.push(
      "One of API Key or Access Token are required, please specify explicitly through the 'api_key'/'access_token' inputs or set the OCTOPUS_API_KEY/OCTOPUS_ACCESS_TOKEN environment variable."
    )

  if (parameters.apiKey && parameters.accessToken) errors.push('Only one of API Key or Access Token can be supplied.')

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
