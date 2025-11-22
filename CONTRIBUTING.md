# Contributing to VueMarkik

Thank you for your interest in contributing to VueMarkik!

## Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **pnpm**: Version 10 or higher (required - do not use npm or yarn)

### Initial Setup

1. Fork the repository on GitHub
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/vuemarkik.git
   cd vuemarkik
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Commands

```bash
pnpm playground        # Run interactive playground
pnpm test              # Run all tests
pnpm lint:fix          # Fix linting errors
pnpm build             # Build the library
pnpm docs:dev          # Run documentation site locally
```

## Development Workflow

1. Make your changes to the source code in [src/](src/)
2. Add tests in [tests/](tests/) directory
3. Test interactively using `pnpm playground`
4. Ensure tests pass: `pnpm test`
5. Update documentation.
6. Lint: `pnpm lint:fix`

## Testing

```bash
pnpm test                          # Run all tests
pnpm test:watch                    # Run tests in watch mode
pnpm vitest tests/Markdown.test.ts # Run specific test file
```

Tests use Vitest with Vue Test Utils. Place test files in [tests/](tests/) and use helpers from [tests/helpers.ts](tests/helpers.ts).

## Questions?

- Check the [documentation](https://vuemarkik.dev)
- Open an [issue](https://github.com/tom-auger/vuemarkik/issues) for discussion
