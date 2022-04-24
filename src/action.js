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

    if (bumpRgx.test(payload.head_commit.message)) {
        const pkjPath = path.join(__dirname, "../", "package.json")
        const data = fs.readFileSync(pkjPath, 'utf8')

        let pkj = JSON.parse(data)
        console.log(pkjPath, pkj);

        let newHash = createHash("sha512").update(data).digest("hex");
        newHash = newHash.slice(0, 6)

        if (typeof pkj.hash !== "undefined" && pkj.hash !== newHash) {
            pkj.hash = newHash
            fs.writeFileSync(pkjPath, JSON.stringify(pkj))
            console.log("Updated package.json hash to:", newHash)
        } else if (typeof pkj.info.hash !== "undefined" && pkj.info.hash !== newHash) {
            pkj.info.hash = newHash
            fs.writeFileSync(pkjPath, JSON.stringify(pkj))
            console.log("Updated package.json hash to:", newHash)
        }
        console.log(newHash);
    }

    console.log(payload.head_commit.message, bumpRgx.test(payload.head_commit.message))
}

run()