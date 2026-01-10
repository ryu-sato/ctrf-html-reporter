# ctrf-html-reporter

Report test result of CTRF (Common Test Report Format) as HTML.

[![npm version](https://badge.fury.io/js/ctrf-html-reporter.svg)](https://www.npmjs.com/package/ctrf-html-reporter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

`ctrf-html-reporter` is a tool that converts test reports in [CTRF (Common Test Report Format)](https://ctrf.io/) format into beautiful HTML reports. It uses VitePress to generate interactive and easy-to-read test reports.

![Image](https://github.com/user-attachments/assets/bcdea904-282b-4099-969b-eaa4bcdd32ea)

see movie: https://github.com/user-attachments/assets/89b4976d-c8a2-499d-92aa-cb515e11a581

## Features

- Convert CTRF format test reports to HTML
- Beautiful and readable report UI
- Visualization and insights of test results
- Simple command-line interface

## Usage

### Using with npx

You can also run it directly without installation:

```bash
npx ctrf-html-reporter path/to/report.ctrf.json
```

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

## Report Features

The generated HTML report provides multiple views to help you analyze your test results:

### Overview

The Overview page displays a comprehensive summary of your test results. Here you can see:
- Tool Information
- Test Environment
- Overall test statistics (passed, failed, skipped)
- Test execution summary

### Suites

The Suites view organizes test results by suite with powerful analysis features:
- Filter tests by status, tags, and flaky tests to find what matters
- Visualize suite performance with interactive charts to identify bottlenecks
- Navigate hierarchical test structure and view detailed test information
- Analyze problem areas with failure and flaky test correlation charts

### Insights

The Insights view provides comparison with previous test results and baseline. This feature helps you:
- Compare current results against previous and baseline reports
- Easily identify changes in overall report metrics
- Track test case status changes (new failures, fixed tests, etc.)
- Understand test result trends over time
- Sort and filter tests by metrics or changes to focus on problem areas

To enable insights comparison, specify previous reports. The baseline report is identified from the previous reports by its start time:

```bash
# Compare with previous reports (can be a file, glob pattern, or directory)
ctrf-html-reporter path/to/report.ctrf.json --previous-report-path path/to/previous.ctrf.json

# Compare with multiple previous reports using glob pattern
ctrf-html-reporter path/to/report.ctrf.json --previous-report-path "reports/*.ctrf.json"

# Specify which report to use as baseline (identified by start time)
ctrf-html-reporter path/to/report.ctrf.json \
  --previous-report-path path/to/reports/ \
  --baseline-report-path path/to/baseline.ctrf.json
```

**Note:** The baseline report must be included in the previous reports. When specified, it is identified by matching the start time (value of `{ results.summary.start }`) of the test execution.

### Timeline

The Timeline view displays test execution in chronological order. This visualization helps you:
- See start and stop times for each test case
- Identify long-running tests at a glance
- Understand test execution patterns
- Optimize test execution time by finding bottlenecks

### AI Insights

The AI Insights view displays AI-powered analysis of your test results. This feature helps you:
- Get AI-generated insights about overall test results
- View AI analysis for failed tests to quickly understand root causes
- Access intelligent suggestions for fixing test failures

To enable AI insights, use [ai-ctrf](https://www.npmjs.com/package/ai-ctrf) to add AI analysis to your CTRF report before generating the HTML report.

## Command Line Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `<report.ctrf.json>` | - | Path to the CTRF report file (required) | - |
| `--output-path <path>` | `-o` | Output directory for the HTML report | `.ctrf/report` |
| `--previous-report-path <path or glob pattern or directory>` | `-p` | Path to previous CTRF report file(s) or directory for comparison | - |
| `--baseline-report-path <path>` | `-b` | Path to the baseline CTRF report file (must be included in previous reports, identified by start time) | - |
| `--version` | `-V` | Output the version number | - |
| `--help` | `-h` | Display help information | - |

## Requirements

- Node.js >= 20.19.0

## License

MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

This project uses [VitePress](https://vitepress.dev/) and [CTRF](https://ctrf.io/).

---

If you have any problems or questions, please feel free to create an [Issue](https://github.com/ryu-sato/ctrf-html-reporter/issues)!
