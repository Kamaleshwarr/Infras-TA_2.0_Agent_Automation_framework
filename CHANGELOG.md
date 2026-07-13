# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-07-13

### Added

- ESLint, Prettier, and EditorConfig for unified code style
- Husky and lint-staged pre-commit quality gates
- GitHub Actions CI workflow with Allure artifact upload
- Winston enterprise logging (replaces console.log)
- BrowserFactory supporting chromium, chrome, firefox, edge, webkit
- Multi-environment files: `.env.dev`, `.env.qa`, `.env.uat`, `.env.prod`
- TestDataProvider abstraction for future CSV/Excel/DB/API sources
- RetryHelper for transient browser and network failures
- npm scripts: regression, sanity, cross-browser, retry execution modes
- Recommended test tags: @smoke, @regression, @sanity, @critical, @ui, @api, @wip
- Architecture diagrams in documentation
- Future capability placeholders: api, database, performance, visual, accessibility
- CHANGELOG.md and LICENSE (MIT)
- Retain-on-failure artifact strategy with configurable toggles

### Changed

- BrowserManager refactored to use BrowserFactory
- Default artifact settings: tracing and video disabled by default (opt-in)
- lint script now runs ESLint + TypeScript + Prettier check
- Login feature tagged with @regression, @sanity, @critical, @ui

### Fixed

- Video files cleaned up on passing scenarios (retain-on-failure)
- Environment loading order: `.env.{env}` → `.env` → process env

## [1.0.0] - 2026-07-13

### Added

- Initial enterprise Playwright BDD framework
- BaseActions, BaseAssertions, BasePage layers
- Login reference module (POM + Cucumber + Allure)
- BrowserManager with per-worker browser reuse
- Multi-environment configuration
- Documentation-first `.cursor/` knowledge base
- Comprehensive docs/ and per-folder README files

[1.1.0]: https://github.com/Kamaleshwarr/Infras-TA_2.0_Agent_Automation_framework/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Kamaleshwarr/Infras-TA_2.0_Agent_Automation_framework/releases/tag/v1.0.0
