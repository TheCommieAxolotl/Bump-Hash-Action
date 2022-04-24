const core = require('@actions/core');
const github = require("@actions/github");

async function run() {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const PACKAGE_PATH = core.getInput('PACKAGE_PATH');

    const octokit = github.getOctokit(GITHUB_TOKEN);

    const { context = {} } = github;
    const { push } = context.payload

    console.log("push", "context", "GITHUB_TOKEN");
    console.log(push, context, GITHUB_TOKEN)
}

run()