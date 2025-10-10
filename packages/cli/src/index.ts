#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { loginCommand } from './commands/login';
import { logoutCommand } from './commands/logout';
import { whoamiCommand } from './commands/whoami';
import { linkCommand } from './commands/link';
import { unlinkCommand } from './commands/unlink';
import { switchCommand } from './commands/switch';
import { pullCommand } from './commands/pull';
import { listCommand } from './commands/list';
import { infoCommand } from './commands/info';

const program = new Command();

program
  .name('commet')
  .description('Commet CLI - Manage your billing platform from the command line')
  .version('0.3.0');

// Authentication commands
program.addCommand(loginCommand);
program.addCommand(logoutCommand);
program.addCommand(whoamiCommand);

// Project commands
program.addCommand(linkCommand);
program.addCommand(unlinkCommand);
program.addCommand(switchCommand);
program.addCommand(infoCommand);

// Type generation commands
program.addCommand(pullCommand);
program.addCommand(listCommand);

// Error handling
program.exitOverride();

try {
  program.parse(process.argv);
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('outputHelp')) {
      // Help was displayed, exit cleanly
      process.exit(0);
    }
    console.error(chalk.red('Error:'), error.message);
  }
  process.exit(1);
}

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

