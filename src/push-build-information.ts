import { isDebug } from '@actions/core'
import { context } from '@actions/github'
import { Commit, PushEvent } from '@octokit/webhooks-types/schema'
import {
  buildInformationPush,
  Client,
  CreateOctopusBuildInformationCommand,
  IOctopusBuildInformationCommit,
  PackageIdentity
} from '@octopusdeploy/api-client'
import { InputParameters } from './input-parameters'

export async function pushBuildInformationFromInputs(
  client: Client,
  runId: number,
  parameters: InputParameters
): Promise<void> {
  // get the branch name
  let branch: string = parameters.branch || context.ref
  if (branch.startsWith('refs/heads/')) {
    branch = branch.substring('refs/heads/'.length)
  }

  const pushEvent = context.payload as PushEvent | undefined
  const repoUri: string = pushEvent?.repository?.url || `https://github.com/${context.repo.owner}/${context.repo.repo}`
  const commits: IOctopusBuildInformationCommit[] =
    pushEvent?.commits?.map((commit: Commit) => {
      return {
        Id: commit.id,
        Comment: commit.message
      }
    }) || []

  const packages: PackageIdentity[] = []
  for (const packageId of parameters.packages) {
    packages.push({
      Id: packageId,
      Version: parameters.version
    })
  }

  const command: CreateOctopusBuildInformationCommand = {
    spaceName: parameters.space,
    BuildEnvironment: 'GitHub Actions',
    BuildNumber: context.runNumber.toString(),
    BuildUrl: `${repoUri}/actions/runs/${runId}`,
    Branch: branch,
    VcsType: 'Git',
    VcsRoot: `${repoUri}`,
    VcsCommitNumber: context.sha,
    Commits: commits,
    Packages: packages
  }

  if (isDebug()) {
    client.info(`Build Information:\n${JSON.stringify(command, null, 2)}`)
  }

  await buildInformationPush(client, command, parameters.overwriteMode)

  client.info('Successfully pushed build information to Octopus')
}
