name: 🚀 Pull Request
description: Submit changes to Assetrix
title: "[type]: brief description"
labels: ["triage"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for contributing to Assetrix! Please fill in the details below and remove any irrelevant sections.
  - type: input
    id: issue
    attributes:
      label: Related Issue
      description: Link the issue this PR resolves (e.g. `Closes #123`).
  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: What does this PR change and why?
    validations:
      required: true
  - type: textarea
    id: changes
    attributes:
      label: Changes Made
      description: Bullet-point list of the key changes.
      value: |
        -
    validations:
      required: true
  - type: textarea
    id: testing
    attributes:
      label: Testing
      description: How was this change tested?
      value: |
        - [ ] Frontend: `npm run lint` passes
        - [ ] Frontend: `npm run typecheck` passes
        - [ ] Backend: `npm run lint` passes
        - [ ] Backend: `npm test` passes
        - [ ] Manual verification performed
  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots / Recordings
      description: If the PR changes UI, add screenshots or a short screen recording.
  - type: checkboxes
    id: checklist
    attributes:
      label: Pre-merge Checklist
      options:
        - label: No secrets or `.env*` files are committed
        - label: CHANGELOG updated under "Unreleased"
        - label: Docs (README / Swagger) updated if behavior changed
        - label: Code follows existing conventions
