# npm Publishing Setup with OIDC

This document explains how to configure npm publishing with OpenID Connect (OIDC) for secure, token-less deployments.

## Why OIDC?

- ✅ No long-lived npm tokens in GitHub secrets
- ✅ Automatic token rotation
- ✅ Better security with short-lived credentials
- ✅ Provenance attestation for supply chain security

## Setup Steps

### 1. Configure npm Account

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click "Generate New Token" → "Automation"
3. Copy the token (you'll need it only once for GitHub secrets)

**Alternative (Recommended): Use npm Granular Access Tokens**

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click "Generate New Token" → "Granular Access Token"
3. Configure:
   - **Packages and scopes**: Select `@commet/node` and `commet`
   - **Permissions**: Read and write
   - **Organizations**: None (or your organization)
   - **IP Ranges**: Optional (GitHub Actions IPs if you want to restrict)
4. Copy the token

### 2. Add Token to GitHub Secrets

1. Go to your repository: https://github.com/commet-labs/commet-node
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

### 3. Enable Provenance (Optional but Recommended)

Provenance adds cryptographic proof of where and how your package was built.

In `package.json` for both packages, ensure:

```json
{
  "publishConfig": {
    "access": "public",
    "provenance": true
  }
}
```

✅ Already configured in this monorepo!

### 4. Verify Workflow Permissions

The `.github/workflows/release.yml` needs these permissions:

```yaml
permissions:
  contents: write      # To create git tags
  pull-requests: write # To create Version Packages PR
  id-token: write      # For OIDC authentication
```

✅ Already configured!

## Testing the Setup

### Dry Run (Local)

Test publishing without actually publishing:

```bash
cd packages/node
pnpm publish --dry-run --no-git-checks

cd ../cli
pnpm publish --dry-run --no-git-checks
```

### First Real Publish

1. Commit your changes
2. Push to `main` branch
3. GitHub Actions will:
   - Run CI checks
   - Create a "Version Packages" PR
4. Review and merge the PR
5. GitHub Actions will automatically publish to npm

## Troubleshooting

### Error: "Need to provide authToken"

**Solution**: Check that `NPM_TOKEN` secret is set correctly in GitHub repository settings.

### Error: "You do not have permission to publish"

**Solution**: 
1. Ensure your npm token has write permissions for the packages
2. For scoped packages (`@commet/node`), ensure you have access to the `@commet` scope
3. You may need to create the scope first: `npm owner add YOUR_USERNAME @commet`

### Error: "Package name already taken"

**Solution**:
- `@commet/node`: Choose a different scope or package name
- `commet`: This is the original package name and should work

### Provenance Verification Failed

**Solution**: Ensure:
1. `provenance: true` is in `publishConfig`
2. Workflow has `id-token: write` permission
3. Publishing from GitHub Actions (not locally)

## Manual Publishing (Emergency)

If automated publishing fails, you can publish manually:

```bash
# Login to npm
npm login

# Build packages
pnpm build

# Publish SDK
cd packages/node
npm publish --access public

# Publish CLI
cd ../cli
npm publish --access public
```

## Package URLs After Publishing

- SDK: https://www.npmjs.com/package/@commet/node
- CLI: https://www.npmjs.com/package/commet

## Verification

After publishing, verify:

```bash
# Check SDK
npm view @commet/node

# Check CLI
npm view commet

# Install and test
npm install @commet/node
npm install -g commet
commet --version
```

## Security Best Practices

1. ✅ Use granular access tokens (not classic tokens)
2. ✅ Enable 2FA on your npm account
3. ✅ Use provenance for supply chain security
4. ✅ Rotate tokens periodically
5. ✅ Never commit tokens to git
6. ✅ Use OIDC when possible (future improvement)

## Future: Full OIDC (No Tokens)

npm is working on full OIDC support (no tokens needed at all). When available:

1. Configure trusted publishers in npm
2. Remove `NPM_TOKEN` secret
3. Update workflow to use OIDC directly

Stay updated: https://github.blog/changelog/2023-04-19-npm-provenance-public-beta/

## References

- [npm Publishing with GitHub Actions](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [Changesets GitHub Action](https://github.com/changesets/action)

