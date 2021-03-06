import fs from 'fs';
import chalk from 'chalk';

export const targets = fs.readdirSync('packages').filter(async (f) => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false;
  }
  const pkg = await import(`../packages/${f}/package.json`);
  if (pkg.private && !pkg.buildOptions) {
    return false;
  }
  return true;
});

export const fuzzyMatchTarget = (partialTargets, includeAllMatching) => {
  const matched = [];
  partialTargets.forEach((partialTarget) => {
    for (const target of targets) {
      if (target.match(partialTarget)) {
        matched.push(target);
        if (!includeAllMatching) {
          break;
        }
      }
    }
  });
  if (matched.length) {
    return matched;
  } else {
    console.log();
    console.error(
      `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
        `Target ${chalk.underline(partialTargets)} not found!`
      )}`
    );
    console.log();

    process.exit(1);
  }
};
