# Create a new migration

```bash
npm run migration:generate src/migrations/<migration name>
```

# Run migrations

```bash
npm run migration:run ./src/database.init.ts
```

# Revert migration

```bash
npm run migration:revert ./src/database.init.ts
```

This command will execute down in the latest executed migration
