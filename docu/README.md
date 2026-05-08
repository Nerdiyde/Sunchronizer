# Sunchronizer Documentation Hub

This folder is the technical documentation entry point for building, wiring, configuring, and validating Sunchronizer.

## Start Here By Task

- I want to wire my tracker:
   [Cable Plan Guide](cable_plan/README.md)
- I want measured real-world performance data:
   [Measurement Overview](measurements/MEASUREMENT_OVERVIEW.md)
- I want firmware details and configuration:
   [Firmware README](../firmware/README.md)
- I want to understand hardware evolution and design decisions:
   [Development History](development_history/DEVELOPMENT_HISTORY.md)
- I need quick answers first:
   [FAQ](../FAQ.md)

## Documentation Map

- [cable_plan](cable_plan/)
   Wiring diagrams (HTML), connection BOMs (TSV), and WireViz source (YAML), versioned by PCB revision.
- [measurements](measurements/)
   Day-by-day test reports and aggregated tracking performance summaries.
- [development_history](development_history/)
   Prototype timeline, revision changes, and lessons learned.
- [diagrams](diagrams/)
   Architecture and concept diagrams.
- [datasheets](datasheets/)
   Component reference sheets.
- [education](education/)
   Teaching-oriented material and classroom modules.

## Wiring Documents (Quick Orientation)

Inside each PCB revision folder under [cable_plan](cable_plan/), you typically find:

- `*.html`: visual wiring plan for assembly
- `*.bom.tsv`: machine-readable material/connection table
- `*.yaml`: WireViz source file

Always verify your PCB revision before using a wiring plan.

## Local Docs Website (VitePress)

To view this documentation as a local website:

```bash
cd docu
npm install
npm run docs:dev
```

To build static output:

```bash
npm run docs:build
```

Build output is written to `.vitepress/dist`.

## Related Resources

- [Main README](../README.md)
- [Firmware Guide](../firmware/README.md)
- [Pictures Gallery](../pictures/README.md)
- [GitHub Wiki](https://github.com/Nerdiyde/Sunchronizer/wiki)

---

Last updated: May 2026
