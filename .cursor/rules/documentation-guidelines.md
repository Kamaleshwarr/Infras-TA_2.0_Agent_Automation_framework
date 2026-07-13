# Documentation Guidelines

## Documentation-First Development

Documentation is **mandatory** and has equal importance to code.

## Before Implementing

1. Check if documentation exists for the target area.
2. Update existing docs if behavior will change.
3. Create docs for new folders, modules, or utilities.
4. Then implement code.

## Required Documentation

| Change | Update |
|--------|--------|
| New `src/` folder | Add `README.md` in that folder |
| New module (Login, Dashboard) | Update module README + `docs/` if user-facing |
| New env variable | Update `.env.example` + `docs/configuration.md` |
| Architecture change | Update `.cursor/rules/architecture.md` + ADR |
| New npm script | Update `README.md` + `docs/running-tests.md` |

## README Template (Module Folder)

```markdown
# {Folder Name}

## Purpose
What this folder contains and why it exists.

## Responsibilities
Bullet list of what belongs here.

## Coding Standards
Rules specific to this folder.

## Examples
Code snippets showing correct usage.

## Related
Links to other folders/docs.
```

## `.cursor/` Directory

The `.cursor/` folder is the **AI knowledge base**. Keep it synchronized with implementation. When standards evolve, update rules before or alongside code changes.

## Living Documentation

- Review docs in every PR.
- Never merge undocumented folders.
- Treat outdated docs as bugs.

## Anti-Patterns

- "I'll document it later."
- README with only a one-line description.
- Duplicating the same content without cross-linking.
