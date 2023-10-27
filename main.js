const core = require('@actions/core');
const github = require('@actions/github');

const { giteaApi } = require("gitea-js");
const fetch = require('cross-fetch');
const excludes = core.getInput('excludes')?.trim()?.split(",");

async function run() {
  try {    
    const api = new giteaApi(
      core.getInput('serverUrl')
        || (github.context.runId && github.context.serverUrl)
        || 'https://gitea.com/',
      {
        token: core.getInput('token'),
        customFetch: fetch,
      },
    );
    
    const [owner, repo] = (
      core.getInput('repository')
        || github.context.repository
        || 'gitea/tea'
    ).split("/");

    const releases = (
      await api.repos.repoListReleases(owner, repo)
    )
      .data
      .filter(
        (release) => (excludes || [])
          .reduce(
            (acc, exclude) => acc
              && !release[exclude],
            true,
          ),
      );
    if (releases.length) {
      core.setOutput('release', releases[0].tag_name);
      core.setOutput('id', String(releases[0].id));
      core.setOutput('description', String(releases[0].body));
      // core.setOutput('releases', releases);
    } else {
      core.setFailed("No valid releases");
    }
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
