Get Latest Release
==================

A simple gitea action to get the latest release from another repository. No authentication required.

based on https://github.com/pozetroninc/github-action-get-latest-release.git

Configuration
=============

Example Repository - https://github.com/pozetroninc/github-action-get-latest-release

**Inputs**

Name | Description | Example
--- | --- | ---
repository | The repository name in full | sigyl-actions/gitea-action-get-latest-release

**Additional Inputs (Optional)**
Name | Description | Example
--- | --- | ---
excludes | comma separated lists - if release field preset will exlude | "prerelease, draft"
token | GitHub token or personal access token | `${{ secrets.GITHUB_TOKEN }}` or `${{ secrets.PERSONAL_ACCESS_TOKEN }}`

**Outputs**

Name | Description | Example
--- | --- | ---
release | The latest release version tag | v0.3.0
id | The latest release version id | 12345
description | The latest release description body | This is an example release

Usage Example
=============

``` yaml
name: Build Docker Images
on: [push, repository_dispatch]

jobs:
  build:
    name: RedisTimeSeries
    runs-on: ubuntu-latest
    steps:
      - id: keydb
        uses: sigyl-actions/gitea-action-get-latest-release@main
        with:
          excludes: prerelease, draft
      - id: timeseries
        uses: sigyl-actions/gitea-action-get-latest-release@main
        with:
          repository: RedisTimeSeries/RedisTimeSeries
      - uses: actions/checkout@v3
      - uses: docker/build-push-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
          repository: sigyl-actions/keydb-timeseries
          dockerfile: timeseries.dockerfile
          build_args: KEY_DB_VERSION=${{ steps.keydb.outputs.release }}, REDIS_TIME_SERIES_VERSION=${{ steps.timeseries.outputs.release }}
          tags: latest, ${{ steps.keydb.outputs.release }}_${{ steps.timeseries.outputs.release }}

```