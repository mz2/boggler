<!--
=============================================================================
SYNC IMPACT REPORT
=============================================================================
Version change: 1.0.0 → 1.1.0
Constitution Type: Amendment (MINOR version bump)

Modified principles:
- Code Quality Gates: Added linting and formatting requirements (gates 3-4)

Added sections:
- Linting gate (ESLint) - gate 3
- Formatting gate (Prettier) - gate 4

Changes to existing gates:
- Previous gates 3-5 renumbered to 5-7

Templates requiring updates:
- ✅ specs/001-word-grid-game/tasks.md (updated - added T006a-T006f for linting/formatting/CI)
- ✅ specs/001-word-grid-game/quickstart.md (updated - added section 6 for linting/formatting setup)

Follow-up TODOs:
- None - all affected documentation has been updated

Notes:
- Amendment triggered by user request for linting, formatting, and CI setup
- Ensures code quality standards are enforced via automated tooling
- CI/CD pipeline (gate 5) now includes linting and formatting checks
=============================================================================

=============================================================================
SYNC IMPACT REPORT (v1.0.0)
=============================================================================
Version change: [TEMPLATE] → 1.0.0
Constitution Type: Initial ratification (from template)

Modified principles:
- PRINCIPLE_1: Test-Driven Development (new)

Added sections:
- Core Principles section fully populated
- Governance section fully defined
- Development Workflow section added

Removed sections:
- Template placeholders removed

Templates requiring updates:
- ✅ .specify/templates/plan-template.md (validated - contains Constitution Check section)
- ✅ .specify/templates/spec-template.md (validated - aligns with user scenarios and requirements)
- ✅ .specify/templates/tasks-template.md (validated - includes test-first workflow and user story organization)

Follow-up TODOs:
- None - all placeholders have been filled with concrete values

Notes:
- User provided one principle (TDD) which has been expanded into comprehensive testing guidance
- Project purpose and tech stack remain flexible (to be defined as project evolves)
- Additional principles can be added via future amendments
=============================================================================
-->

# Boggler Constitution

## Core Principles

### I. Test-Driven Development (NON-NEGOTIABLE)

Test-driven development is mandatory for all code contributions. The discipline MUST
be followed rigorously:

- **Write tests FIRST**: Before implementing any feature or function, write the test
  that defines expected behavior
- **Ensure tests FAIL**: Verify that newly written tests fail before implementation
  begins (red state)
- **Implement to pass**: Write minimal code required to make tests pass (green state)
- **Refactor with confidence**: Improve code structure while maintaining passing tests
- **Three-tier testing strategy**:
  - **Logic tests**: Required for all pure functions and business logic
  - **Component tests**: Required where appropriate for modules, services, and UI components
  - **End-to-end tests**: Required when possible for critical user journeys

**Rationale**: TDD ensures code correctness, maintainability, and serves as living
documentation. It prevents regression, enables fearless refactoring, and enforces
clear thinking about interfaces before implementation.

**Enforcement**: No pull request may be merged without accompanying tests. Code review
MUST verify that tests were written before implementation (check commit history or
ask author to confirm).

## Development Workflow

### Code Quality Gates

All contributions MUST pass these gates before merge:

1. **Test coverage gate**: New code MUST have tests (logic, component, and/or e2e as appropriate)
2. **Test-first verification**: Reviewer MUST verify tests were written before implementation
3. **Linting gate**: All code MUST pass ESLint checks with zero errors and warnings
4. **Formatting gate**: All code MUST pass Prettier formatting checks
5. **All tests passing**: CI/CD pipeline MUST show green status
6. **Code review approval**: At least one reviewer MUST approve changes
7. **Constitution compliance**: Reviewer MUST verify adherence to all principles

### Testing Organization

Tests MUST be organized according to the following structure:

```
tests/
├── unit/          # Pure function and logic tests
├── component/     # Module, service, and component tests
└── e2e/           # End-to-end user journey tests
```

Naming convention: `test_[feature_or_function_name].py` or `[FeatureName].test.ts`
(adjust extension per language).

## Governance

### Amendment Procedure

1. Proposed changes MUST be documented with rationale
2. Amendments MUST be approved by project maintainer(s)
3. Version MUST be incremented following semantic versioning:
   - **MAJOR** (X.0.0): Backward incompatible changes, principle removal/redefinition
   - **MINOR** (0.X.0): New principles added, material expansions to existing guidance
   - **PATCH** (0.0.X): Clarifications, wording fixes, non-semantic refinements
4. All dependent templates and documentation MUST be updated for consistency
5. A Sync Impact Report MUST be generated and prepended to the constitution file

### Compliance Review

- All pull requests MUST be reviewed for constitution compliance
- Violations MUST be justified in writing and approved by maintainer(s)
- Repeated violations without justification indicate need for constitution amendment
  or contributor education
- Complexity introduced must be justified against simpler alternatives

### Versioning & History

- RATIFICATION_DATE marks original adoption
- LAST_AMENDED_DATE updates whenever changes are made
- Constitution supersedes all other development practices unless explicitly noted
- For runtime development guidance, refer to `AGENTS.md` or equivalent agent
  instruction files

**Version**: 1.1.0 | **Ratified**: 2025-11-08 | **Last Amended**: 2025-11-08
