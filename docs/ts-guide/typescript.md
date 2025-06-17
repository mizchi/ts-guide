# TypeScript Configuration and Performance Optimization

This document covers advanced TypeScript configuration and performance optimization techniques.

## Base Configuration

The baseline setup uses the following `tsconfig.json` configuration:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "esModuleInterop": true,
    "allowImportingTsExtensions": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["vitest/importMeta"]
  }
}
```

### Key Configuration Options

- `target: "esnext"`: Compile to the latest JavaScript features
- `module: "esnext"`: Use ES modules
- `moduleResolution: "bundler"`: Modern module resolution for bundlers
- `allowImportingTsExtensions`: Allow `.ts` extensions in imports (for Deno compatibility)
- `strict: true`: Enable all strict type checking options
- `skipLibCheck`: Skip type checking of declaration files for faster builds

## React Configuration

For React projects, add the following to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    // ... existing options
    "jsx": "react-jsx",
    "lib": ["dom", "dom.iterable", "esnext"],
    "types": ["vitest/importMeta", "@types/react", "@types/react-dom"]
  }
}
```

## Performance Optimization with TypeScript Native Preview

Microsoft provides an experimental TypeScript implementation called `@typescript/native-preview` that offers significantly faster type checking performance.

### Installation

```bash
pnpm add @typescript/native-preview -D
```

### Usage

Replace `tsc` with `tsgo` in your scripts:

```json
{
  "scripts": {
    "typecheck": "tsgo --noEmit"
  }
}
```

### Benefits

- **Faster Type Checking**: The native implementation can be several times faster than the standard TypeScript compiler
- **Drop-in Replacement**: Works with existing TypeScript configurations
- **Experimental Features**: Access to cutting-edge TypeScript features before they land in the stable release

### Considerations

- This is an experimental preview and may have bugs or missing features
- Not recommended for production builds yet
- Best suited for development-time type checking to improve iteration speed
- Monitor the [official announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-native-previews/) for updates

## Performance Tips

1. **Enable Incremental Compilation**:
   ```json
   {
     "compilerOptions": {
       "incremental": true,
       "tsBuildInfoFile": ".tsbuildinfo"
     }
   }
   ```

2. **Optimize Module Resolution**:
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "bundler",
       "resolveJsonModule": true,
       "allowJs": false
     }
   }
   ```

3. **Use `skipLibCheck` wisely**: While it improves performance, ensure you trust your dependencies' type definitions.

4. **For monorepos**: See [workspace.md](workspace.md) for TypeScript Project References configuration.

## Advanced Configuration Options

### Strict Mode Options

```json
{
  "compilerOptions": {
    "strict": true,
    // Or configure individually:
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Path Mapping

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

### Output Configuration

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

## Integration with Build Tools

### Vite

Vite has built-in TypeScript support but doesn't perform type checking during build. Use `tsc` or `tsgo` in parallel:

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "dev": "vite"
  }
}
```

### esbuild

esbuild doesn't perform type checking. Always run TypeScript separately:

```json
{
  "scripts": {
    "build": "tsc && esbuild src/index.ts --bundle --outfile=dist/index.js",
    "build:fast": "tsgo && esbuild src/index.ts --bundle --outfile=dist/index.js"
  }
}
```

## Troubleshooting

### Common Issues

1. **Slow Type Checking**: Consider using `@typescript/native-preview` or enabling incremental compilation
2. **Memory Issues**: Increase Node.js memory limit: `NODE_OPTIONS="--max-old-space-size=4096" tsc`
3. **Module Resolution Errors**: Ensure `moduleResolution` matches your build tool's behavior

### Debugging TypeScript Configuration

```bash
# Show resolved configuration
tsc --showConfig

# Trace module resolution
tsc --traceResolution

# List files included in compilation
tsc --listFiles
```