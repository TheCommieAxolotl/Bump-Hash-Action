const core = require('@actions/core');
const github = require("@actions/github");

async function run() {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const PACKAGE_PATH = core.getInput('PACKAGE_PATH');

    const octokit = github.getOctokit(GITHUB_TOKEN);
    const bumpRgx = /bump[\s]?version/gi

    const { context = {} } = github;
    const payload = context.payload

    console.log(context, payload.head_commit.message, bumpRgx.test(payload.head_commit.message))
}

run()