const core = require('@actions/core');
const github = require("@actions/github");
const path = require('path')
const fs = require('fs')
const { createHash } = require("crypto");
const { exec } = require('child_process');

async function run() {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const PACKAGE_PATH = core.getInput('PACKAGE_PATH');

    const octokit = github.getOctokit(GITHUB_TOKEN);
    const bumpRgx = /bump[\s]?(v|version)/gi
    const { context = {} } = github;
    const payload = context.payload;

    if (bumpRgx.test(payload.head_commit.message)) {
        const pkjPath = path.join(__dirname, PACKAGE_PATH);
        if (!fs.existsSync(pkjPath)) return console.error("package.json not found");
        const data = fs.readFileSync(pkjPath, 'utf8')

        let pkj = JSON.parse(data)
        console.log(`Writing New Hash to ${pkjPath}`)

        let newHash = createHash("sha512").update(data).digest("hex");
        newHash = newHash.slice(0, 6)

        if (typeof pkj.hash !== "undefined" && pkj.hash !== newHash) {
            pkj.hash = newHash
            fs.writeFileSync(pkjPath, JSON.stringify(pkj, null, "\t"));
            console.log("Updated package.json hash to:", newHash)
            
exec(`
git config --local user.email "41898282+github-actions[bot]@users.noreply.github.com"
git config --local user.name "github-actions[bot]"
git commit -m "Bump Hash" -a
git push -u origin main
`,
    (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }
    },
);
        } else if (typeof pkj.info.hash !== "undefined" && pkj.info.hash !== newHash) {
            pkj.info.hash = newHash
            fs.writeFileSync(pkjPath, JSON.stringify(pkj, null, "\t"));
            console.log("Updated package.json hash to:", newHash)
            exec(
                `
git config --local user.email "41898282+github-actions[bot]@users.noreply.github.com"
git config --local user.name "github-actions[bot]"
git commit -m "Bump Hash" -a
git push -u origin main
`,
                (err, stdout, stderr) => {
                    if (err) {
                        console.error(`exec error: ${err}`);
                        return;
                    }
                },
            );
        }
    }
}

run()