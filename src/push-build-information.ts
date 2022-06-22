import {InputParameters} from './input-parameters'
import {info, setFailed} from '@actions/core'
import {context} from '@actions/github'
import {PushEvent, Commit} from '@octokit/webhooks-types/schema'
import {Client, ClientConfiguration} from '@octopusdeploy/api-client'
import {NewOctopusPackageVersionBuildInformationResource, CommitDetail} from '@octopusdeploy/message-contracts'

async function getOctopusClient(parameters: InputParameters): Promise<Client> {
  const config: ClientConfiguration = {
    apiKey: process.env['OCTOPUS_API_KEY'],
    apiUri: process.env['OCTOPUS_HOST'],
    space: parameters.space,
    autoConnect: true
  }

  const client: Client = await Client.create(config)
  if (client === undefined) throw new Error('Client could not be constructed')

  return client
}

export async function pushBuildInformation(
  runId: string,
  parameters: InputParameters
): Promise<void> {
  // get the branch name
  let branch: string = parameters.branch || context.ref
  if (branch.startsWith('refs/heads/')) {
    branch = branch.substring('refs/heads/'.length)
  }

  const pushEvent: PushEvent | undefined = context.payload as PushEvent
  const repoUri: string =
    pushEvent?.repository?.url ||
    `https://github.com/${context.repo.owner}/${context.repo.repo}`
  const commits: CommitDetail[] =
    pushEvent?.commits?.map((commit: Commit) => {
      return {
        Id: commit.id,
        Comment: commit.message,
        LinkUrl: commit.url
      }
    }) || []

  const build: NewOctopusPackageVersionBuildInformationResource = {
    PackageId: '',
    Version: parameters.version,
    OctopusBuildInformation: {
      BuildEnvironment: 'GitHub Actions',
      BuildNumber: runId.toString(),
      BuildUrl: `${repoUri}/actions/runs/${runId}`,
      Branch: branch,
      VcsType: 'Git',
      VcsRoot: `${repoUri}`,
      VcsCommitNumber: context.sha,
      Commits: commits
    }
  }

  if (parameters.debug) {
    info(`Build Information:\n${JSON.stringify(build, null, 2)}`)
  }

  try {
    const client: Client = await getOctopusClient(parameters)
    const buildInfoUriTmpl: string = client.getLink('BuildInformation')

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
