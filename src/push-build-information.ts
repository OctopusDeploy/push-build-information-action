import {InputParameters} from './input-parameters'
import {info, setFailed} from '@actions/core'
import {exec, ExecOptions} from '@actions/exec'
import {context} from '@actions/github'
import {promises as fsPromises} from 'fs'

function getArgs(parameters: InputParameters): string[] {
  info('🔣 Parsing inputs...')

  const args = ['build-information']

  if (
    parameters.overwriteMode.length > 0 &&
    parameters.overwriteMode !== 'FailIfExists'
  ) {
    if (
      parameters.overwriteMode !== 'OverwriteExisting' &&
      parameters.overwriteMode !== 'IgnoreIfExists'
    ) {
      setFailed(
        'The input value, overwrite_mode is invalid; accept values are "FailIfExists", "OverwriteExisting", and "IgnoreIfExists".'
      )
    }
    args.push(`--overwrite-mode=${parameters.overwriteMode}`)
  }

  if (parameters.packages.length > 0)
    parameters.packages.map(p => args.push(`--package-id=${p}`))

  if (parameters.space.length > 0) args.push(`--space=${parameters.space}`)
  if (parameters.version.length > 0)
    args.push(`--version=${parameters.version}`)

  return args
}

export async function pushBuildInformation(
  runId: string,
  parameters: InputParameters
): Promise<void> {
  // get the branch name
  let branch = parameters.branch
  if (branch === undefined || branch === '') {
    branch = context.ref;
    if (branch.startsWith('refs/heads/')) {
      branch = branch.substring('refs/heads/'.length)
    }
  }

  const repoUri = `https://github.com/${context.repo.owner}/${context.repo.repo}`

  const build = {
    BuildEnvironment: 'GitHub Actions',
    BuildNumber: runId.toString(),
    BuildUrl: `${repoUri}/actions/runs/${runId}`,
    Branch: branch,
    VcsType: 'Git',
    VcsRoot: `${repoUri}`,
    VcsCommitNumber: context.sha
  }

  info(`Writing build information to buildInformation.json`)
  const jsonContent = JSON.stringify(build)
  await fsPromises.writeFile('buildInformation.json', jsonContent)

  if (parameters.debug) {
    info(`Build Information: ${jsonContent}`)
  }

  const args = getArgs(parameters)
  args.push('--file=buildInformation.json')

  const options: ExecOptions = {
    listeners: {
      stdline: (line: string) => {
        if (line.length <= 0) return

        if (line.includes('Octopus Deploy Command Line Tool')) {
          const version = line.split('version ')[1]
          info(`🐙 Using Octopus Deploy CLI ${version}...`)
          return
        }

        if (line.includes('Handshaking with Octopus Server')) {
          info(`🤝 Handshaking with Octopus Deploy`)
          return
        }

        if (line.includes('Authenticated as:')) {
          info(`✅ Authenticated`)
          return
        }

        if (line === 'Push successful') {
          info(`🎉 Push successful!`)
          return
        }

        info(line)
      }
    },
    silent: true
  }

  try {
    await exec('octo', args, options)
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}
