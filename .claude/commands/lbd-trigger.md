Trigger a specific phase of the LBD prospecting engine via GitHub Actions workflow_dispatch.

Usage: /lbd-trigger [phase]
Phases: 1 (prospect+outreach), nurture, 4 (reply monitor), 6 (dashboard), weekly

Run: gh workflow run lbd-prospecting.yml --field phase=$ARGUMENTS

If no phase specified, default to phase 1.
If gh CLI is not available, show the user the command to run manually.
