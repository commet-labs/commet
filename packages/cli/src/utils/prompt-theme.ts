import chalk from "chalk";

/**
 * Commet brand accent — the "highlight" token from the platform palette
 * (paper / ink / mutedInk / highlight) used across docs, OG images, and UI.
 */
export const commetColor = chalk.hex("#e8a07c");

/**
 * Theme for @inquirer/prompts — only the selected/highlighted option and the
 * prefix arrow take the brand color; everything else stays neutral.
 */
export const promptTheme = {
  prefix: commetColor("❯"),
  style: {
    answer: commetColor,
    message: chalk.bold,
    error: chalk.red,
    help: chalk.dim,
    highlight: commetColor.bold,
    description: chalk.dim,
    defaultAnswer: chalk.dim,
  },
};
