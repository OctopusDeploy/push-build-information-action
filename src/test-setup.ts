import * as tmp from 'tmp'

tmp.setGracefulCleanup()
const tmpdir = tmp.dirSync({template: 'push-build-information-XXXXXX'})
process.env = Object.assign(process.env, {
  INPUT_API_KEY: process.env['OCTOPUS_APIKEY'],
  INPUT_DEBUG: false,
  INPUT_IGNORE_SSL_ERRORS: false,
  INPUT_SERVER: process.env['OCTOPUS_URL'],
  INPUT_PACKAGES: 'test.nupkg',
  INPUT_OVERWRITE_MODE: 'OverwriteExisting',
  INPUT_USE_DELTA_COMPRESSION: false,
  RUNNER_TEMP: tmpdir.name,
  RUNNER_TOOL_CACHE: tmpdir.name,
  GITHUB_ACTION: '1',
  GITHUB_RUN_ID: '1'
})
