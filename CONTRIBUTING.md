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

4. **Build the report via commander**

To develop the command:

```bash
pnpm run bin:dev path/to/report.ctrf.json
```

and

```bash
npx serve .ctrf/report -p 3000
```

This will start the Web server, and you can access it in your browser at `http://localhost:3000`.

### Build

To build the project:

```bash
# Build the reporter UI
CTRF_REPORT_PATH=path/to/report.ctrf.json pnpm run reporter:build

# Build bin and reporter
pnpm run build
```

### Testing

To run tests:

```bash
# Run tests once
pnpm run bin:test

# Run tests in watch mode
pnpm run bin:test:watch

# Run tests with coverage report
pnpm run bin:test:coverage
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

### Managing Changes with Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

#### Creating a Changeset

When you make changes that should be included in the changelog:

```bash
pnpm changeset
```

This will prompt you to:
1. Select the type of change (patch, minor, or major)
2. Provide a description of your changes

The changeset will be stored in the `.changeset` directory and should be committed with your changes.

#### Versioning and Publishing

To update package versions based on changesets:

```bash
pnpm version
```

To build and publish the package:

```bash
pnpm release
```
