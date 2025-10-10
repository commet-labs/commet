import { Command } from 'commander';
import chalk from 'chalk';
import {
  authExists,
  loadProjectConfig,
  projectConfigExists,
} from '../utils/config';

export const infoCommand = new Command('info')
  .description('Display information about the current project')
  .action(async () => {
    console.log(chalk.bold('\n📦 Project Information\n'));

    // Check auth
    if (!authExists()) {
      console.log(chalk.yellow('Authentication: Not logged in'));
      console.log(chalk.dim('Run `commet login` to authenticate\n'));
      return;
    }

    console.log(chalk.green('Authentication: Logged in ✓'));

    // Check project config
    if (!projectConfigExists()) {
      console.log(chalk.yellow('\nProject: Not linked'));
      console.log(chalk.dim('Run `commet link` to connect to an organization\n'));
      return;
    }

    const projectConfig = loadProjectConfig();
    if (!projectConfig) {
      console.log(chalk.red('\nProject: Invalid configuration'));
      return;
    }

    console.log(chalk.green('\nProject: Linked ✓'));
    console.log(chalk.dim('  Organization:'), projectConfig.orgName);
    console.log(chalk.dim('  Organization ID:'), projectConfig.orgId);
    console.log(chalk.dim('  Environment:'), projectConfig.environment);
    console.log(
      chalk.dim('\nRun `commet pull` to generate type definitions\n'),
    );
  });

