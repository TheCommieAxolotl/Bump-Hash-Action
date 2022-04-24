const core = require('@actions/core');
const github = require("@actions/github");
const path = require('path')

async function run() {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const PACKAGE_PATH = core.getInput('PACKAGE_PATH');

    const octokit = github.getOctokit(GITHUB_TOKEN);
    const bumpRgx = /bump[\s]?(v|version)/gi
    const { context = {} } = github;
    const payload = context.payload;

    if (bumpRgx.test(payload.head_commit.message)) {
        console.log(__dirname)
    }

    console.log(payload.head_commit.message, bumpRgx.test(payload.head_commit.message))
}

run()