import * as tmp from 'tmp'

tmp.setGracefulCleanup()
const tmpdir = tmp.dirSync({template: 'push-build-information-XXXXXX'})
process.env = Object.assign(process.env, {
  INPUT_BRANCH: 'main',
  INPUT_DEBUG: false,
  INPUT_VERSION: '1.0.0',
  INPUT_PACKAGES: 'test',
  INPUT_OVERWRITE_MODE: 'OverwriteExisting',
  OCTOPUS_CLI_API_KEY: process.env['OCTOPUS_APIKEY'],
  OCTOPUS_CLI_SERVER: process.env['OCTOPUS_URL'],
  RUNNER_TEMP: tmpdir.name,
  RUNNER_TOOL_CACHE: tmpdir.name,
  GITHUB_ACTION: '1',
  GITHUB_RUN_ID: '1',
  GITHUB_REPOSITORY: 'test/test'
})
