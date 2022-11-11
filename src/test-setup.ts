import * as tmp from 'tmp'

tmp.setGracefulCleanup()
const tmpdir = tmp.dirSync({ template: 'push-build-information-XXXXXX' })
process.env = Object.assign(process.env, {
  INPUT_VERSION: '1.0.0',
  INPUT_PACKAGES: 'test',
  INPUT_OVERWRITE_MODE: 'OverwriteExisting',
  OCTOPUS_SPACE: 'Default',
  OCTOPUS_API_KEY: process.env['OCTOPUS_TEST_APIKEY'],
  OCTOPUS_URL: process.env['OCTOPUS_TEST_URL'],
  RUNNER_TEMP: tmpdir.name,
  RUNNER_TOOL_CACHE: tmpdir.name,
  GITHUB_ACTION: '1',
  GITHUB_RUN_ID: '2',
  GITHUB_RUN_NUMBER: '2',
  GITHUB_REPOSITORY: 'test/test',
  GITHUB_REF: 'refs/heads/main'
})
