# Changesets

When making changes that should trigger a version bump:

1. Run `pnpm changeset` (or `pnpm changeset:add` if in watch mode)
2. Select packages affected
3. Choose version bump type (major/minor/patch)
4. Write summary of changes
5. Commit the generated `.md` file

The CI will create a "Version Packages" PR automatically.

## Note for Watch Mode

If you're running commands in watch mode (like `pnpm dev`), use `pnpm changeset:add` instead of `pnpm changeset` to avoid interactive prompts.

