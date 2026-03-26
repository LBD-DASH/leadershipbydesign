Show the current Ideal Customer Profile (ICP) and verify it's consistent across all agents.

Read CLAUDE.md for the canonical ICP, then grep across all supabase/functions/*.ts files for any references to excluded industries being used as targets (not in exclusion lists).

Search for: "Financial Services", "Insurance", "Banking", "Education", "Consulting", "FSI" in contexts where they appear as INCLUDED targets rather than exclusions.

Report any misalignment found.
