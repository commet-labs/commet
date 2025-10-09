import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import {
  authExists,
  projectConfigExists,
  saveProjectConfig,
  loadProjectConfig,
} from '../utils/config';
import { apiRequest, getBaseURL } from '../utils/api';

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface OrganizationsResponse {
  success: boolean;
  organizations: Organization[];
}

export const linkCommand = new Command('link')
  .description('Link this project to a Commet organization')
  .action(async () => {
    // Check auth
    if (!authExists()) {
      console.log(chalk.red('✗ Not authenticated'));
      console.log(chalk.dim('Run `commet login` first'));
      return;
    }

    // Check if already linked
    if (projectConfigExists()) {
      const config = loadProjectConfig();
      console.log(chalk.yellow('⚠ This project is already linked'));
      console.log(
        chalk.dim(`Organization: ${config?.orgName} (${config?.environment})`),
      );
      console.log(
        chalk.dim('\nRun `commet unlink` first if you want to change the organization'),
      );
      return;
    }

    const spinner = ora('Fetching organizations...').start();

    // Fetch user's organizations
    const baseURL = getBaseURL('sandbox');
    const result = await apiRequest<OrganizationsResponse>(
      `${baseURL}/api/cli/organizations`,
    );

    if (result.error || !result.data) {
      spinner.fail('Failed to fetch organizations');
      console.error(chalk.red('Error:'), result.error);
      return;
    }

    const { organizations } = result.data;

    if (organizations.length === 0) {
      spinner.stop();
      console.log(chalk.yellow('⚠ No organizations found'));
      console.log(
        chalk.dim('Create an organization at https://billing.commet.co first'),
      );
      return;
    }

    spinner.stop();

    // Prompt user to select organization and environment
    const answers = await inquirer.prompt<{
      orgId: string;
      environment: 'sandbox' | 'production';
    }>([
      {
        type: 'list',
        name: 'orgId',
        message: 'Select organization:',
        choices: organizations.map((org) => ({
          name: `${org.name} (${org.slug})`,
          value: org.id,
        })),
      },
      {
        type: 'list',
        name: 'environment',
        message: 'Select environment:',
        choices: [
          { name: 'Sandbox (Development)', value: 'sandbox' },
          { name: 'Production', value: 'production' },
        ],
        default: 'sandbox',
      },
    ]);

    const selectedOrg = organizations.find((org) => org.id === answers.orgId);
    if (!selectedOrg) {
      console.log(chalk.red('✗ Organization not found'));
      return;
    }

    // Save project config
    saveProjectConfig({
      orgId: selectedOrg.id,
      orgName: selectedOrg.name,
      environment: answers.environment,
    });

    console.log(chalk.green('\n✓ Project linked successfully!'));
    console.log(chalk.dim('\nProject configuration:'));
    console.log(chalk.dim(`  Organization: ${selectedOrg.name}`));
    console.log(chalk.dim(`  Environment: ${answers.environment}`));
    console.log(
      chalk.dim('\nNext step:\n  Run `commet pull` to generate TypeScript types'),
    );
  });

