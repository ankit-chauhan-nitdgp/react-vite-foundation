# modules/

Host-product modules live here. Each module owns its own feature surface:

```
modules/
└── <module-name>/
    ├── api/         # request functions wrapping `core/api`
    ├── hooks/       # createQueryHook / createMutationHook results
    ├── components/  # module-specific React components
    ├── pages/       # route-level pages
    ├── schemas/     # zod schemas
    ├── types/       # module types
    └── index.ts     # public surface (no deep imports outside)
```

The foundation does NOT ship any modules — see `usecase.md` → "Creating a New Module".
