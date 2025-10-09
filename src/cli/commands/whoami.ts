import { Command } from 'commander';
import chalk from 'chalk';
import { authExists, loadProjectConfig } from '../utils/config';

export const whoamiCommand = new Command('whoami')
  .description('Display current authentication and project status')
  .action(async () => {
    // Check auth
    if (!authExists()) {
      console.log(chalk.yellow('⚠ Not logged in'));
      console.log(chalk.dim('Run `commet login` to authenticate'));
      return;
    }

    console.log(chalk.green('✓ Logged in'));

    // Check project config
    const projectConfig = loadProjectConfig();
    if (projectConfig) {
      console.log(chalk.bold('\nProject:'));
      console.log(chalk.dim('Organization:'), projectConfig.orgName);
      console.log(chalk.dim('Environment:'), projectConfig.environment);
    } else {
      console.log(chalk.yellow('\n⚠ No project linked'));
      console.log(chalk.dim('Run `commet link` to connect this directory to an organization'));
    }
  });

