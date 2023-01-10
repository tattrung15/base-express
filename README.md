# Create a new migration

```bash
npm run migration:generate src/migrations/<migration name>
```

# Run migrations

```bash
npm run migration:run ./build/database.init.js
```

# Revert migration

```bash
npm run migration:revert ./build/database.init.js
```

This command will execute down in the latest executed migration
