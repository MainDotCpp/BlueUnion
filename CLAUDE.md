# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

### Root Monorepo Commands
- **Install dependencies**: `pnpm install`
- **Run all apps in dev**: `pnpm dev`
- **Build all apps**: `pnpm build`
- **Lint all**: `pnpm lint`
- **Typecheck all**: `pnpm typecheck`

### Website (apps/website)
- **Run dev**: `pnpm dev:website` or `cd apps/website && pnpm dev`
- **Build**: `pnpm build:website` or `cd apps/website && pnpm build`
- **Typecheck**: `cd apps/website && pnpm typecheck`
- **Lint**: `cd apps/website && pnpm lint`

## Project Architecture and Structure

### High-Level Structure
This is a Monorepo using `pnpm` workspaces.
- `apps/`: Contains the main applications.
  - `website/`: Next.js 15 application (Primary focus).
- `packages/`: (Planned) Shared packages and types.

### Website Architecture (apps/website)
- **Framework**: Next.js 15 with App Router.
- **Styling**: Tailwind CSS with `shadcn/ui` components.
- **Internationalization**: Uses `next-intl`.
  - Config: `apps/website/i18n/`
  - Messages: `apps/website/i18n/messages/{en,zh}.json`
  - Middleware handles locale routing: `apps/website/_middleware.ts`
- **Components**:
  - `components/ui/`: Atomic UI components (shadcn).
  - `components/layout/`: Shared layout components (Header, Footer).
- **Library/Utils**: `lib/utils.ts` for Tailwind merge and class utility.
