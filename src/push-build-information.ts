import {InputParameters} from './input-parameters'
import {info, setFailed} from '@actions/core'
import {context} from '@actions/github'
import {Client, ClientConfiguration} from '@octopusdeploy/api-client'

async function getOctopusClient(parameters: InputParameters): Promise<Client> {
  const config: ClientConfiguration = {
    apiKey: process.env['OCTOPUS_CLI_API_KEY'],
    apiUri: process.env['OCTOPUS_CLI_SERVER'],
    space: parameters.space,
    autoConnect: true
  }

  const client = await Client.create(config)
  if (client === undefined) throw new Error('Client could not be constructed')

  return client
}

export async function pushBuildInformation(
  runId: string,
  parameters: InputParameters
): Promise<void> {
  // get the branch name
  let branch = parameters.branch
  if (branch === undefined || branch === '') {
    // if we don't get a branch passed in, use branch from GitHub context
    branch = context.ref
    if (branch.startsWith('refs/heads/')) {
      branch = branch.substring('refs/heads/'.length)
    }
  }

  const repoUri = `https://github.com/${context.repo.owner}/${context.repo.repo}`

  const build = {
    PackageId: '',
    Version: parameters.version,
    OctopusBuildInformation: {
      BuildEnvironment: 'GitHub Actions',
      BuildNumber: runId.toString(),
      BuildUrl: `${repoUri}/actions/runs/${runId}`,
      Branch: branch,
      VcsType: 'Git',
      VcsRoot: `${repoUri}`,
      VcsCommitNumber: context.sha
    }
  }

  if (parameters.debug) {
    info(`Build Information:\n${JSON.stringify(build, null, 2)}`)
  }

  try {
    const client = await getOctopusClient(parameters)
    const buildInfoUriTmpl = client.getLink('BuildInformation')

    for (const packageId of parameters.packages) {
      info(
        `Pushing build information for package '${packageId}' version '${parameters.version}'`
      )

      build.PackageId = packageId
      await client.post(buildInfoUriTmpl, build, {
        overwriteMode: parameters.overwriteMode
      })

      info('Successfully pushed build information to Octopus')
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
    throw e
  }
}
