# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenCode is an open source AI coding agent built with TypeScript/JavaScript. It's a monorepo using **Bun 1.3+** as the package manager and runtime, with a Turbo build system. The project includes a terminal UI (TUI), web interface, desktop app, and API server.

## Quick Start

- **Install**: `bun install`
- **Default branch**: `dev` (not `main`)
- **Dev environment**: `bun dev` from repo root (starts TUI in interactive mode for `packages/opencode`)
- **Type check**: `bun typecheck` (runs from package directories via Turbo)
- **Lint**: `oxlint`
- **Tests**: From package directories only (e.g., `cd packages/opencode && bun test`)

## Development Commands

### Running OpenCode

```bash
# Terminal UI (TUI) - default, interactive
bun dev                    # Start TUI in packages/opencode directory
bun dev .                  # Run TUI against repo root itself
bun dev <directory>        # Run TUI against specific directory

# Headless API server
bun dev serve              # Start on port 4096 (default)
bun dev serve --port 8080  # Custom port

# Web interface (requires server running separately)
bun dev web                # Start web server + open UI

# Desktop app
bun dev:desktop            # Start Electron app in dev mode

# Web console (special case)
bun dev:console            # Console web app with ulimit adjustment
```

### Building

```bash
# Standalone executable ("localcode")
./packages/opencode/script/build.ts --single

# Desktop app
bun run --cwd packages/desktop build
bun run --cwd packages/desktop package
```

### Type Checking & Linting

```bash
bun typecheck              # Type check all packages (Turbo, runs in parallel)
oxlint                     # Lint the whole repo
bun run lint               # Same as oxlint
```

### Testing

Tests must be run from package directories, not the repo root (guard: `do-not-run-tests-from-root`).

```bash
# From packages/opencode or other packages
bun test                   # Run all tests with 30s timeout
bun test --timeout 60000   # Custom timeout

# Special test suites
bun run test:httpapi       # HTTP API coverage tests
bun run bench:test         # Benchmark test suite
bun run profile:test       # Profile test files
```

## Monorepo Structure

### Main Packages

- **`packages/opencode`** - Core CLI, TUI (SolidJS + opentui), server, and session logic
- **`packages/app`** - Shared web UI components (SolidJS), used by web and desktop
- **`packages/desktop`** - Electron wrapper around the web UI
- **`packages/console`** (subpackages: `app`, `core`, `function`, `mail`, `resource`) - Console admin panel
- **`packages/core`** - Shared utilities, logging, error handling, LLM integrations
- **`packages/llm`** - Language model abstraction layer (supports 20+ providers via `ai` SDK)
- **`packages/web`** - Static web app assets
- **`packages/ui`** - UI component library (TailwindCSS + SolidJS)
- **`packages/plugin`** - Plugin API (`@opencode-ai/plugin`)
- **`packages/sdk/js`** - JavaScript SDK (`@opencode-ai/sdk`)
- **`packages/script`** - Internal build and utility scripts
- **`packages/slack`** - Slack integration
- **`packages/enterprise`** - Enterprise features
- **SDKs** - `sdks/vscode/` for VS Code extension

### Key Directories in `packages/opencode`

- **`src/cli/cmd/`** - CLI command handlers (run, serve, web, tui, etc.)
- **`src/cli/cmd/tui/`** - TUI-specific logic (attach, thread, event, layer, worker)
- **`src/server/`** - Hono API server setup, auth, CORS, event streaming, projectors
- **`src/session/`** - Session management, LLM interactions, tool handling
- **`src/storage/`** - Database (Drizzle ORM with SQLite), schema, migrations
- **`src/config/`** - Configuration modules (each with self-export pattern)
- **`src/effect/`** - Effect utilities, runtime, instance state, service setup
- **`test/`** - Integration and unit tests

## Database

- **ORM**: Drizzle ORM with SQLite
- **Schema location**: `packages/opencode/src/**/*.sql.ts` (files ending with `.sql.ts`)
- **Naming conventions**:
  - Tables and columns: `snake_case`
  - Foreign key columns: `<entity>_id` (e.g., `project_id`)
  - Indexes: `<table>_<column>_idx`
- **Migrations**:
  ```bash
  cd packages/opencode
  bun run db generate --name <slug>  # Creates migration/<timestamp>_<slug>/migration.sql
  ```
- **Configuration**: `packages/opencode/drizzle.config.ts`

## Architecture & Patterns

### Module Shape

Do **not** use `export namespace`. Use flat exports with self-reexport:

```ts
export interface Interface { ... }
export class Service extends Context.Service<Service, Interface>()("@opencode/Name") {}
export const layer = Layer.effect(Service, ...)

export * as Name from "./name"  // Self-reexport at end of file
```

Consumers: `import { Name } from "@/name/name"; yield* Name.Service`

### Effect Framework (Effect v4 beta)

- Use `Effect.gen(function* () { ... })` for composition
- Use `Effect.fn("Domain.method")` for named/traced effects; `Effect.fnUntraced` for internal helpers
- Use `makeRuntime` (from `src/effect/run-service.ts`) for all services
- Use `InstanceState` (from `src/effect/instance-state.ts`) for per-directory/per-project state with automatic cleanup
- Prefer existing Effect services: `FileSystem`, `ChildProcessSpawner`, `HttpClient`, `Path`, `Config`, `Clock`, `DateTime`
- Use `EffectBridge` for native/external callbacks that need to re-enter Effect services

### Configuration

Each config module uses the self-export pattern:

```ts
// src/config/agent.ts
export * as ConfigAgent from "./agent"
```

Consumers import the namespace: `import { ConfigAgent } from "@/config/agent"`

## Code Style

From `AGENTS.md` (key principles):

- **Composition**: Keep functions to one concern unless the helper is reused or names a real concept
- **Variables**: Prefer `const` over `let`; use ternaries/early returns instead of reassignment
- **Control flow**: Avoid `else`; use early returns
- **Destructuring**: Avoid unnecessary destructuring; use dot notation
- **Type**: Avoid `any`; use type inference when possible
- **Comments**: Add only when the "why" is non-obvious (constraints, surprising behavior, workarounds)
- **Helpers**: Place small helpers below main exports; extract only if reused or names a concept
- **Schemas (Drizzle)**: Use `snake_case` for field names so column names auto-match

## Git & PR Workflow

### Commit Messages & PR Titles

Use conventional commits: `type(scope): summary`

**Valid types**: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`

**Optional scopes**: `core`, `opencode`, `tui`, `app`, `desktop`, `sdk`, `plugin`, `acp-next`, etc.

Examples:
- `feat(tui): add dark mode toggle`
- `fix(opencode): resolve crash on startup`
- `docs: update contributing guide`

### PR Requirements

- Link every PR to an existing issue: `Fixes #123` or `Closes #123`
- Keep PRs small and focused
- For UI changes: include screenshots/videos
- For logic changes: explain what was tested and how to verify

### SDK Regeneration

After modifying `packages/opencode/src/server/server.ts` or related API types:

```bash
./packages/sdk/js/script/build.ts
```

This regenerates the TypeScript SDK and related files.

## Testing

- Avoid mocks; test actual implementations
- Migration tests should read per-folder layout (no `_journal.json`)
- Run tests from the package directory, not repo root
- Special test suites in `packages/opencode`: `test:httpapi`, `bench:test`, `profile:test`

## Development Tips

### Running the TUI

For interactive development, start in tmux to avoid blocking:

```bash
tmux new-session -d -s opencode-dev 'bun dev'
tmux capture-pane -pt opencode-dev  # Capture output
tmux kill-session -t opencode-dev   # Stop when done
```

### Debugging with Bun

Most reliable method: use `--inspect=<url>` and attach your debugger.

```bash
bun run --inspect=ws://localhost:6499/ --cwd packages/opencode --conditions=browser ./src/index.ts
```

For TUI with server breakpoints, use `bun dev spawn` instead of `bun dev`.

### Provider Support

New providers are typically added to https://github.com/anomalyco/models.dev, not in this repo. The opencode repo consumes providers from there.

## Tools & Dependencies

- **Package manager**: Bun 1.3+
- **Build**: Turbo (workspace orchestration)
- **Type checking**: TypeScript 5.8 (configured per-package + global)
- **Linting**: oxlint (Rust-based, very fast)
- **Testing**: Bun's built-in test runner
- **UI frameworks**: SolidJS (TUI via opentui, web/desktop)
- **Styling**: TailwindCSS 4
- **ORM**: Drizzle ORM 1.0 RC
- **Effect runtime**: Effect v4 beta
- **LLM SDKs**: Vercel `ai` package with 20+ provider integrations
- **Desktop**: Electron

## Contributing Notes

- Design reviews required for UI/core product features (ask maintainers or check for `help-wanted`/`good-first-issue` labels)
- All PRs must use conventional commits and link to existing issues
- Avoid AI-generated walls of text in PR descriptions—keep it concise
- No `else` statements, `let` reassignments, or unnecessary destructuring
- Parallel tools should be used when applicable (e.g., independent read/glob/grep calls)
