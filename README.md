# ctrf-html-reporter

Report test result of CTRF (Common Test Report Format) as HTML.

[![npm version](https://badge.fury.io/js/ctrf-html-reporter.svg)](https://www.npmjs.com/package/ctrf-html-reporter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

`ctrf-html-reporter` is a tool that converts test reports in [CTRF (Common Test Report Format)](https://ctrf.io/) format into beautiful HTML reports. It uses VitePress to generate interactive and easy-to-read test reports.

https://github.com/user-attachments/assets/cd7e59e9-edbf-4859-9527-d4ba7d4a9396

## Features

- Convert CTRF format test reports to HTML
- Beautiful and readable report UI
- Visualization and insights of test results
- Simple command-line interface
- Support for multiple package managers

## Installation

Choose your package manager to install:

<details open>
<summary><strong>npm</strong></summary>

```bash
npm install ctrf-html-reporter
```
</details>

<details>
<summary><strong>yarn</strong></summary>

```bash
yarn add ctrf-html-reporter
```
</details>

<details>
<summary><strong>pnpm</strong></summary>

```bash
pnpm add ctrf-html-reporter
```
</details>

## Usage

### Basic Usage

Generate an HTML report from a CTRF report file:

```bash
ctrf-html-reporter path/to/report.ctrf.json
```

By default, the report is generated in the `.ctrf/report` directory.

### Custom Output Path

To specify the output destination:

```bash
ctrf-html-reporter path/to/report.ctrf.json --output-path ./html-report
```

### Using with npx

You can also run it directly without installation:

```bash
npx ctrf-html-reporter path/to/report.ctrf.json
```

## Report Features

The generated HTML report provides multiple views to help you analyze your test results:

### Overview

The Overview page displays a comprehensive summary of your test results. Here you can see:
- Tool Information
- Test Environment
- Overall test statistics (passed, failed, skipped)
- Test execution summary

### Suites

The Suites view organizes test results grouped by test suites. This allows you to:
- View test results organized by suite
- Quickly identify which suites have failures
- Navigate through your test structure efficiently

### Insights

(TBD) The baseline specification feature is not yet developed.

The Insights view provides comparison with baseline results. This feature helps you:
- Compare current results against baseline
- Easily identify changes in overall report metrics
- Track test case status changes (new failures, fixed tests, etc.)
- Understand test result trends over time

### Timeline

The Timeline view displays test execution in chronological order. This visualization helps you:
- See start and stop times for each test case
- Identify long-running tests at a glance
- Understand test execution patterns
- Optimize test execution time by finding bottlenecks

## Command Line Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `<report.ctrf.json>` | - | Path to the CTRF report file (required) | - |
| `--output-path <path>` | `-o` | Output directory for the HTML report | `.ctrf/report` |
| `--version` | `-V` | Output the version number | - |
| `--help` | `-h` | Display help information | - |

## Requirements

- Node.js >= 20.19.0

## Contributing

Contributions are welcome! Feel free to participate with bug reports, feature requests, pull requests, and more.

### Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/ryu-sato/ctrf-html-reporter.git
cd ctrf-html-reporter
```

2. **Install dependencies**

This project uses pnpm:

```bash
pnpm install
```

3. **Start the development environment**

To develop the reporter UI:

```bash
pnpm run reporter:dev
```

This will start the VitePress development server, and you can access it in your browser at `http://localhost:5173`.

### Build

To build the project:

```bash
# Build the CLI tool
pnpm run bin:build

# Build the reporter UI
pnpm run reporter:build

# Build both
pnpm run build
```

### Testing

To run tests:

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage report
pnpm run test:coverage
```

### Project Structure

```
ctrf-html-reporter/
├── src/
│   ├── bin/              # CLI tool source code
│   │   ├── index.mts     # Entry point
│   │   ├── builder.mts   # Report build logic
│   │   └── ...
│   ├── reporter/         # VitePress reporter UI
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── dist/                 # Build output directory
├── package.json
└── tsconfig.json
```

### Contributing Guidelines

1. **Create an Issue**
   - If you find a bug or have an idea for a new feature, please create an Issue first
   - Check existing Issues to make sure there are no duplicates

2. **Development Workflow**
   - Create a new branch from the main branch
   - Make your changes and add/update tests
   - Use clear and descriptive commit messages
   - Ensure all tests pass before creating a pull request

3. **Pull Request**
   - Clearly describe the changes and reasons in the PR description
   - Reference related Issues if any
   - Respond to code review feedback

4. **Coding Standards**
   - Use TypeScript
   - Follow the existing code style
   - Add tests as needed

### Development Tips

- **Local Testing**: You can use `pnpm link` to test the package locally
- **Debugging**: Use Node.js debugger to debug the CLI tool
- **Reporter Preview**: You can preview the built reporter with `pnpm run reporter:preview`

## License

MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

This project uses [VitePress](https://vitepress.dev/) and [CTRF](https://ctrf.io/).

---

If you have any problems or questions, please feel free to create an [Issue](https://github.com/ryu-sato/ctrf-html-reporter/issues)!
