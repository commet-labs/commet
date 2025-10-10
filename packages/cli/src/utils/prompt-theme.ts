import chalk from "chalk";

/**
 * Custom theme for CLI prompts
 * Uses Commet brand color: hsl(174.67, 41.28%, 78.63%)
 * Approximated to RGB: #A0DED4 (cyan-ish mint)
 */
export const commetColor = chalk.hex("#5BC0B0"); // Más saturado y oscuro
/**
 * Theme configuration for @inquirer/prompts
 * Only the selected/highlighted option shows in mint color
 * Other options remain in default white/gray
 */
export const promptTheme = {
  prefix: commetColor("❯"),
  style: {
    answer: commetColor,
    message: chalk.bold,
    error: chalk.red,
    help: chalk.dim,
    highlight: commetColor.bold, // Selected option in mint
    description: chalk.dim,
    defaultAnswer: chalk.dim,
  },
};
