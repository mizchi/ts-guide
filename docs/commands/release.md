# Release Package

Automate the npm package release process with version bumping and publishing.

```
/project:release
```

## What it does

1. **Check git status**
   - Ensure working directory is clean
   - Verify on main/master branch
   - Check if up to date with remote

2. **Bump version**
   - Run `pnpm version patch` (or minor/major as specified)
   - Create version commit
   - Tag the release

3. **Push changes**
   - Push commits to remote
   - Push tags to remote

4. **Publish to npm**
   - Run `pnpm publish`
   - Add `--access public` if not private package
   - Handle monorepo with directory option

## Usage

Basic release (patch version):
```
/project:release
```

Specify version type:
```
/project:release minor
/project:release major
```

Monorepo - publish specific package:
```
/project:release --directory packages/my-package
```

## Process Flow

```bash
# 1. Check git status
git status
git fetch
git diff HEAD origin/main

# 2. Bump version
pnpm version patch

# 3. Push changes
git push
git push --tags

# 4. Publish
pnpm publish --access public  # if not private
```

## Monorepo Support

For workspaces, specify the package directory:

```bash
cd packages/my-package
pnpm version patch
cd ../..
git push
git push --tags
pnpm publish --directory packages/my-package --access public
```

## Safety Checks

- ✓ Clean working directory
- ✓ On main/master branch
- ✓ No uncommitted changes
- ✓ Up to date with remote
- ✓ Tests passing
- ✓ Build successful

## Example Output

```
Checking git status...
✓ Working directory clean
✓ On branch main
✓ Up to date with origin

Bumping version...
✓ Version bumped from 1.0.0 to 1.0.1

Pushing to git...
✓ Pushed commits
✓ Pushed tag v1.0.1

Publishing to npm...
✓ Published my-package@1.0.1

Release complete! 🎉
```