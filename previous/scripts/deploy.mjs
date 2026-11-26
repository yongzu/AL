// Publish dist/ to the gh-pages branch (GitHub Pages → https://yongzu.github.io/AL/).
// BI의 scripts/deploy.mjs를 그대로 따르되, 처음 배포라 gh-pages가 아직 없어도 동작한다.
//
// The branch is rebuilt from dist/ every time, so anything else published there is replaced.
import { execSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';

const git = (args, cwd = 'dist') => execSync(`git ${args}`, { cwd, stdio: 'inherit' });
const read = (args) => execSync(`git ${args}`).toString().trim();

const remote = read('remote get-url origin');
const name = read('config user.name');
const email = read('config user.email');

rmSync('dist/.git', { recursive: true, force: true });
writeFileSync('dist/.nojekyll', '');
git('init -q -b gh-pages');
git('add -A');
git(`-c user.name="${name}" -c user.email="${email}" commit -q -m "Deploy to GitHub Pages"`);
git(`push -f ${remote} gh-pages`);
rmSync('dist/.git', { recursive: true, force: true });
console.log('Deployed → https://yongzu.github.io/AL/');
