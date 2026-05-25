# OpenCode Changelog

All notable changes to this project are documented here. This file tracks enhancements, features, bug fixes, and documentation updates.

## [Unreleased]

### Added
- RTL support for Arabic and Hebrew languages
- CLAUDE.md development guidance documentation
- CHANGES folder with changelog and history tracking

---

## [2025-05-25] - RTL Support for Arabic & Hebrew

### Added
- **RTL Language Detection** - Automatic detection of Arabic and Hebrew text
- **Content Component RTL Support**:
  - ContentMarkdown component with RTL layout
  - ContentText component with RTL layout
  - ContentBash component with RTL layout for descriptions
- **Font Support** - IBM Plex Sans Arabic and Hebrew fonts for better typography
- **CSS RTL Styling**:
  - Direction and text alignment adjustments
  - List padding repositioning for RTL
  - Copy button positioning for RTL
  - Table alignment and borders for RTL
  - Code block preservation in LTR even in RTL parent

### Modified
- `packages/app/src/index.css` - Added Arabic/Hebrew font imports
- `packages/web/src/components/share/content-markdown.tsx` - RTL detection and dir attribute
- `packages/web/src/components/share/content-markdown.module.css` - RTL styling
- `packages/web/src/components/share/content-text.tsx` - RTL detection and dir attribute
- `packages/web/src/components/share/content-text.module.css` - RTL styling
- `packages/web/src/components/share/content-bash.tsx` - RTL detection for descriptions
- `packages/web/src/components/share/content-bash.module.css` - RTL styling for header

### New Files
- `packages/web/src/components/share/rtl-detect.ts` - Shared RTL detection utility

### Details
- **Detection Threshold**: 15% of characters must be RTL to enable RTL mode
- **Supported Scripts**: 
  - Arabic: U+0600–U+06FF
  - Hebrew: U+0590–U+05FF
- **Fonts Used**: IBM Plex Sans Arabic, IBM Plex Sans Hebrew
- **Code Preservation**: Code blocks remain LTR for readability

### Git Commits
- `ca712062` - feat(web): add RTL support for Arabic and Hebrew
- `ae3c5a9` - docs: add CLAUDE.md with development guidance

---

## [2025-05-25] - Initial Documentation

### Added
- **CLAUDE.md** - Comprehensive development guidance including:
  - Quick start instructions
  - Development commands (TUI, web, desktop, API server)
  - Build, lint, and test commands
  - Monorepo structure and package purposes
  - Database conventions (Drizzle ORM)
  - Architecture patterns (Effect v4, modules, config)
  - Code style guidelines
  - Git workflow and PR requirements
  - Testing approach
  - Development tips and tools

### Purpose
Provides future Claude Code instances with essential project context and development guidance for faster productivity.

---

## Format Guide

Each change entry includes:
- **Date** in YYYY-MM-DD format
- **Type**: Added, Modified, Fixed, Changed, Removed, Security, Deprecated
- **Component/Area**: Which part of the codebase was affected
- **Description**: What changed and why
- **Files**: List of modified or new files
- **Git Commits**: Associated commit hashes and messages

## Versioning

Changes are organized by date with detailed git commit references. Version numbers follow semantic versioning when releases are tagged.

## How to Update This File

When making significant changes:

1. Add entry to the [Unreleased] section at the top
2. When releasing, move to dated section with version number
3. Include:
   - What changed
   - Which files were modified
   - Why the change was made
   - Git commit hashes
4. Keep entries organized by date (newest first)

## Related Files

- **CHANGES/** - Change history and documentation
- **CLAUDE.md** - Development guidance
- **.git/logs** - Full git history with all commits
