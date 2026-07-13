# .cursor — AI Knowledge Base

## Purpose

Single source of truth for AI-assisted and human development. Contains coding standards, architecture rules, prompts, and architecture decisions.

## Structure

```
.cursor/
├── rules/           # Mandatory standards (15 documents)
├── prompts/         # Step-by-step guides for common tasks
└── decisions/       # Architecture Decision Records (ADRs)
```

## Rules

| Document | Topic |
|----------|-------|
| [architecture.md](rules/architecture.md) | Layer diagram and design principles |
| [coding-standards.md](rules/coding-standards.md) | TypeScript and framework rules |
| [folder-structure.md](rules/folder-structure.md) | Project layout |
| [naming-conventions.md](rules/naming-conventions.md) | File, class, method naming |
| [playwright-best-practices.md](rules/playwright-best-practices.md) | Wait strategy, locators, performance |
| [cucumber-best-practices.md](rules/cucumber-best-practices.md) | Features, steps, tags, hooks |
| [page-object-guidelines.md](rules/page-object-guidelines.md) | Page class rules |
| [locator-guidelines.md](rules/locator-guidelines.md) | Locator file rules |
| [base-class-guidelines.md](rules/base-class-guidelines.md) | BaseActions/BaseAssertions rules |
| [reporting-guidelines.md](rules/reporting-guidelines.md) | Allure configuration |
| [logging-guidelines.md](rules/logging-guidelines.md) | Logger usage |
| [documentation-guidelines.md](rules/documentation-guidelines.md) | Documentation-first development |
| [git-workflow.md](rules/git-workflow.md) | Commits and PRs |
| [branching-strategy.md](rules/branching-strategy.md) | Branch naming and flow |
| [troubleshooting.md](rules/troubleshooting.md) | Common issues |

## Prompts

| Prompt | Use When |
|--------|----------|
| [create-new-module.md](prompts/create-new-module.md) | Adding a full feature module |
| [create-new-page.md](prompts/create-new-page.md) | Adding a page object |
| [create-new-feature.md](prompts/create-new-feature.md) | Adding Gherkin scenarios |
| [code-review-checklist.md](prompts/code-review-checklist.md) | Reviewing PRs |

## Decisions

[architecture-decisions.md](decisions/architecture-decisions.md) — ADRs documenting key design choices.

## Maintenance

When standards change, update the relevant rule **before or alongside** code changes. Never allow `.cursor/` to become outdated.
