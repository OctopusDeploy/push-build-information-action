# push-build-information-action

<img alt= "" src="https://github.com/OctopusDeploy/push-build-information-action/raw/main/assets/github-actions-octopus.png" />

This is a GitHub Action to push build information to [Octopus Deploy](https://octopus.com/).

This action captures the following build information:
  - **BuildNumber**: _The unique ID of the build that was triggered._
  - **BuildUrl**: _The link to the build that was triggered._
  - **Branch**: _The branch or tag name that triggered the build._
  - **VcsRoot**: _The URL to the GitHub repository._
  - **VcsCommitNumber**: _The commit SHA that triggered the build._

This action **does not** capture any commits since the last build.

## Examples

Incorporate the following actions in your workflow to push build information to Octopus Deploy using an API key, a target instance (i.e. `server`), and a package:

```yml
env:
  OCTOPUS_HOST: ${{ secrets.OCTOPUS_URL }}
  OCTOPUS_API_KEY: ${{ secrets.OCTOPUS_API_KEY }}
  OCTOPUS_SPACE: '<spaceid>'
steps:
  - uses: actions/checkout@v2
  - name: Push build information to Octopus Deploy 🐙
    uses: OctopusDeploy/push-build-information-action@<version>
    with:
      packages: |
        '<packageId1>'
      version: '<versionofpackages>'
```

## 📥 Inputs

The following inputs are required:

| Name       | Description                                                                | Default |
| :--------- | :------------------------------------------------------------------------- | :-----: |
| `packages` | A multi-line list of packages to push build information to Octopus Deploy. |         |
| `version`  | The version of the package(s).                                             |         |

The following inputs are optional:

| Name             | Description                                                                                                                                                                       |    Default     |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------: |
| `branch`         | The branch name, if omitted the GitHub ref will be used.                                                                                                                          |                |
| `debug`          | Logs the build information data.                                                                                                                                                  |    `false`     |
| `overwrite_mode` | Determines the action to perform with build information if it already exists in the repository. Valid input values are `FailIfExists`, `OverwriteExisting`, and `IgnoreIfExists`. | `FailIfExists` |
