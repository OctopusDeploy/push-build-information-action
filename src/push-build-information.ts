import { context } from '@actions/github'
import { Commit, PushEvent } from '@octokit/webhooks-types/schema'
import {
  Client,
  CreateOctopusBuildInformationCommand,
  IOctopusBuildInformationCommit,
  pushBuildInformation
} from '@octopusdeploy/api-client'
import { PackageIdentity } from '@octopusdeploy/api-client/dist/operations/pushBuildInformation/package-identity'
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
        id: commit.id,
        comment: commit.message
      }
    }) || []

  const packages: PackageIdentity[] = []
  for (const packageId of parameters.packages) {
    packages.push({
      id: packageId,
      version: parameters.version
    })
  }

  const command: CreateOctopusBuildInformationCommand = {
    spaceName: parameters.space,
    buildEnvironment: 'GitHub Actions',
    buildNumber: context.runNumber.toString(),
    buildUrl: `${repoUri}/actions/runs/${runId}`,
    branch,
    vcsType: 'Git',
    vcsRoot: `${repoUri}`,
    vcsCommitNumber: context.sha,
    commits,
    packages
  }

  if (parameters.debug) {
    client.info(`Build Information:\n${JSON.stringify(command, null, 2)}`)
  }

  await pushBuildInformation(client, command, parameters.overwriteMode)

  client.info('Successfully pushed build information to Octopus')
}
