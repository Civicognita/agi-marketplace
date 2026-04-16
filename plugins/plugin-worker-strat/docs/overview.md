# Strategy Workers

## Overview

Strategy domain workers for planning and prioritization tasks. Provides three workers covering project planning, work prioritization, and high-level strategic direction. This plugin is baked in and cannot be disabled.

## Workers

| Worker ID | Name | Role |
|-----------|------|------|
| `strat.planner` | Planner | Breaks down goals into actionable plans with phases, milestones, and dependencies |
| `strat.prioritizer` | Prioritizer | Evaluates and ranks a backlog of tasks by impact, urgency, and feasibility |
| `strat.strategist` | Strategist | High-level strategic analysis — identifies direction, trade-offs, and long-term implications |

## Dispatch Keywords

`plan`, `prioritize`, `strategy`, `roadmap`, `milestones`, `rank`, `backlog`, `direction`, `trade-offs`, `phases`

## Permissions

`filesystem.read`, `filesystem.write`

## Notes

- Planner output is designed to feed directly into TASKMASTER as a phase spec, compatible with the format produced by `code.engineer`.
- Prioritizer accepts a list of tasks or issues and returns an ordered list with rationale for each ranking decision.
- Strategist operates at a higher level of abstraction — use it before planning when the direction itself is uncertain.
