# push-build-information-action

<img alt= "" src="https://github.com/OctopusDeploy/push-build-information-action/raw/main/assets/github-actions-octopus.png" />

This is a GitHub Action to push build information to [Octopus Deploy](https://octopus.com/).

This action captures the following build information:

- **BuildNumber**: _The unique ID of the build that was triggered._
- **BuildUrl**: _The link to the build that was triggered._
- **Branch**: _The branch or tag name that triggered the build._
- **VcsRoot**: _The URL to the GitHub repository._
- **VcsCommitNumber**: _The commit SHA that triggered the build._
- **Commits**: _List of commits that was part of the build._

## Examples

Incorporate the following actions in your workflow to push build information to Octopus Deploy using an API key, a target instance (i.e. `server`), and a package:

```yml
env:
  OCTOPUS_API_KEY: ${{ secrets.OCTOPUS_API_KEY }} # API key used with Octopus Deploy instance
  OCTOPUS_HOST: ${{ secrets.OCTOPUS_HOST }}       # address of Octopus Deploy instance (i.e. https://demo.octopus.app)
  OCTOPUS_SPACE: '<spacename>'                    # or you can specify a Space ID
steps:
  - uses: actions/checkout@v2
  - name: Push build information to Octopus Deploy 🐙
    uses: OctopusDeploy/push-build-information-action@v1
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
## 🤝 Contributions

Contributions are welcome! :heart: Please read our [Contributing Guide](.github/CONTRIBUTING.md) for information about how to get involved in this project.
