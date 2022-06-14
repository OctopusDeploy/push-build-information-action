# push-build-information-action

<img alt= "" src="https://github.com/OctopusDeploy/push-build-information-action/raw/main/assets/github-actions-octopus.png" />

This is a GitHub Action to push build information to [Octopus Deploy](https://octopus.com/). It requires the [Octopus CLI](https://octopus.com/docs/octopus-rest-api/octopus-cli); please ensure to include [install-octopus-cli-action](https://github.com/OctopusDeploy/install-octopus-cli-action) in your workflow (example below) before using this GitHub Action.

## Examples

Incorporate the following actions in your workflow to push build information to Octopus Deploy using an API key, a target instance (i.e. `server`), and a package:

```yml
env:
  OCTOPUS_CLI_SERVER: ${{ secrets.OCTOPUS_URL }}
  OCTOPUS_CLI_API_KEY: ${{ secrets.OCTOPUS_API_KEY }}
steps:
  - uses: actions/checkout@v2
  - name: Install Octopus CLI 🐙
    uses: OctopusDeploy/install-octopus-cli-action@<version>
    with:
      version: latest
  - name: Push build information to Octopus Deploy 🐙
    uses: OctopusDeploy/push-build-information-action@<version>
    with:
      packages: |
        '<packageId1>'
      space: '<space>'
      version: '<versionofpackages>'
```

## 📥 Inputs

The following inputs are required:

| Name       | Description                                                                | Default |
| :--------- | :------------------------------------------------------------------------- | :-----: |
| `packages` | A multi-line list of packages to push build information to Octopus Deploy. |         |
| `space`    | The name or ID of a space within which this command will be executed.      |         |
| `version`  | The version of the package(s).                                             |         |

The following inputs are optional:

| Name             | Description                                                                                                                                                                       |    Default     |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------: |
| `branch`         | The branch name, if omitted the GitHub ref will be used.                                                                                                                          |                |
| `debug`          | Logs the build information data.                                                                                                                                                  |    `false`     |
| `overwrite_mode` | Determines the action to perform with build information if it already exists in the repository. Valid input values are `FailIfExists`, `OverwriteExisting`, and `IgnoreIfExists`. | `FailIfExists` |
