# Deno Deploy

## Manual Deployment

Deploy directly from GitHub:

1. Visit [dash.deno.com](https://dash.deno.com)
2. Connect your GitHub repository
3. Set entrypoint: `src/mod.ts`
4. Deploy

## CLI Deployment

```bash
# Install deployctl
deno install -Afg jsr:@deno/deployctl

# Deploy
deployctl deploy --project=my-project src/mod.ts
```

## GitHub Actions Deployment

Add to `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: denoland/setup-deno@v1
      
      - name: Deploy to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: my-project
          entrypoint: ./src/mod.ts
```

## Environment Variables

Set in Deno Deploy dashboard or via CLI:

```bash
deployctl deploy --env=API_KEY=secret --project=my-project src/mod.ts
```

In code:

```typescript
const apiKey = Deno.env.get("API_KEY");
```