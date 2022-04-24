const core = require('@actions/core');
const github = require("@actions/github");
const path = require('path')
const fs = require('fs')
const { createHash } = require("crypto");

async function run() {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const PACKAGE_PATH = core.getInput('PACKAGE_PATH');

    const octokit = github.getOctokit(GITHUB_TOKEN);
    const bumpRgx = /bump[\s]?(v|version)/gi
    const { context = {} } = github;
    const payload = context.payload;

    console.log(require.main.filename)

    if (bumpRgx.test(payload.head_commit.message)) {
        const pkjPath = path.join(__dirname, "../", "package.json")
        fs.readFile(pkjPath, 'utf8', (err, data) => {console.log(data)})

        console.log(pkjPath);

        const newHash = createHash("sha512");

        console.log(newHash)
    }

    console.log(payload.head_commit.message, bumpRgx.test(payload.head_commit.message))
}

run()