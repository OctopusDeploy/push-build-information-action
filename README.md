# push-build-information-action

<img alt= "" src="https://github.com/OctopusDeploy/push-build-information-action/raw/main/assets/github-actions-octopus.png" />

This is a GitHub Action to push build information to [Octopus Deploy](https://octopus.com/).

## Examples

Incorporate the following actions in your workflow to push build information to Octopus Deploy using an API key, a target instance (i.e. `server`), and a package:

```yml
env:
  OCTOPUS_HOST: ${{ secrets.OCTOPUS_URL }}
  OCTOPUS_API_KEY: ${{ secrets.OCTOPUS_API_KEY }}
steps:
  - uses: actions/checkout@v2
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
| `version`  | The version of the package(s).                                             |         |

The following inputs are optional:

| Name             | Description                                                                                                                                                                       |    Default     |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------: |
| `branch`         | The branch name, if omitted the GitHub ref will be used.                                                                                                                          |                |
| `debug`          | Logs the build information data.                                                                                                                                                  |    `false`     |
| `overwrite_mode` | Determines the action to perform with build information if it already exists in the repository. Valid input values are `FailIfExists`, `OverwriteExisting`, and `IgnoreIfExists`. | `FailIfExists` |
