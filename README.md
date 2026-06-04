# SepoliaScan

Read-only blockchain explorer for **Sepolia testnet** - blocks, transactions, and addresses. Built with Next.js, [viem](https://viem.sh), and [Alchemy](https://www.alchemy.com/) RPC.

## Features

- Search by address, transaction hash, or block number
- Latest blocks (live via WebSocket) and latest transactions
- Block, transaction, and address detail pages
- Address transfer history via `alchemy_getAssetTransfers`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

3. Add a free [Alchemy API key](https://dashboard.alchemy.com/) (Sepolia app):

```env
ALCHEMY_API_KEY=your_key_here
NEXT_PUBLIC_ALCHEMY_API_KEY=your_key_here
```

`NEXT_PUBLIC_*` is required for live block updates in the browser (WebSocket).

4. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | Description             |
| ---------------------- | ----------------------- |
| `npm run dev`          | Development server      |
| `npm run build`        | Production build        |
| `npm run start`        | Start production server |
| `npm run lint`         | ESLint                  |
| `npm run lint:fix`     | ESLint with auto-fix    |
| `npm run format`       | Prettier format all     |
| `npm run format:check` | Prettier check only     |
| `npm run test`         | Vitest (watch mode)     |
| `npm run test:run`     | Vitest (single run)     |
| `npm run test:e2e`     | Playwright E2E          |

## Testing

**Unit & component** - [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react):

```bash
npm run test:run
```

Covers `lib/search`, `lib/shared/format`, `lib/block/summary`, and `SearchBar` navigation.

**E2E** - [Playwright](https://playwright.dev) (starts dev server automatically):

```bash
npx playwright install chromium   # first time only
npm run test:e2e
```

E2E works without `ALCHEMY_API_KEY` (navigation + validation). With a key, block pages load live data.

## Git hooks

On every `git commit`, [Husky](https://typicode.github.io/husky/) runs [lint-staged](https://github.com/lint-staged/lint-staged) so only **staged** files are checked:

| Staged files | Actions |
| ------------ | ------- |
| `*.{js,jsx,ts,tsx,mjs,cjs}` | Prettier write → ESLint `--fix` |
| `*.{json,css,md,yml,yaml}` | Prettier write |

Hooks are installed automatically when you run `npm install` (`prepare` → `husky`). Config lives in `package.json` → `lint-staged` and `.husky/pre-commit`.

If pre-commit does not run after clone:

```bash
npm run prepare
```

Run checks manually without committing:

```bash
npm run format:check && npm run lint
```

## Project structure

```
app/                    # Next.js routes
components/
  block/                # BlockTable, LiveBlocks
  tx/                   # TransactionTable
  address/              # TransferTable
  search/               # SearchBar
  explorer/             # Header, StatCards, SetupNotice
  shared/ui/            # DataRow, RelativeTime
lib/
  shared/               # chain, client, format, types
  block/                # block API + summary
  tx/                   # latest transactions
  address/              # Alchemy transfers
  search/               # query parsing
```

## Stack

- **Next.js 16** (App Router, Server Components)
- **viem** - Ethereum JSON-RPC
- **Alchemy** - HTTP + WebSocket + Transfers API
- **Tailwind CSS 4** - styling (palette in `app/globals.css`)

## License

See [LICENSE](LICENSE).
