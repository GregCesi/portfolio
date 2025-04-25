# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## 🛠️ Résolution du problème `Access Denied` (EACCES)

Si vous avez des erreurs du type `EACCES: permission denied`, exécutez les commandes suivantes depuis la racine du projet :

```bash
cd ~/Code/dossierparfait
sudo chown -R $(whoami) .
rm -rf node_modules package-lock.json .nuxt
npm install
npm run dev


Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
```
