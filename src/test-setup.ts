import * as tmp from 'tmp'

tmp.setGracefulCleanup()
const tmpdir = tmp.dirSync({template: 'push-build-information-XXXXXX'})
process.env = Object.assign(process.env, {
  INPUT_API_KEY: process.env['OCTOPUS_APIKEY'],
  INPUT_BRANCH: 'main',
  INPUT_DEBUG: false,
  INPUT_VERSION: '1.0.0',
  INPUT_SERVER: process.env['OCTOPUS_URL'],
  INPUT_PACKAGES: 'test.nupkg',
  INPUT_OVERWRITE_MODE: 'OverwriteExisting',
  RUNNER_TEMP: tmpdir.name,
  RUNNER_TOOL_CACHE: tmpdir.name,
  GITHUB_ACTION: '1',
  GITHUB_RUN_ID: '1',
  GITHUB_REPOSITORY: 'test/test'
})
