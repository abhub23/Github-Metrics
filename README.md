# React + TypeScript + Vite + Github API's

This Project takes two Github profiles and compare them on various stats which are stated by the deveoper to code base of this Repository.

# How to run Locally?

First clone the repository into your machine

```bash
git clone https://github.com/abhub23/Github-Metrics.git
```

Followed by installing required npm packages

```bash
npm install
```

Make sure you have latest version of [Node](https://nodejs.org/en) and [TypeScript](https://www.typescriptlang.org/download/) installed in your System Locally

Finally run the following command to run on your localhost

```bash
npm run dev
```

## New Things i have learned during this Project

- Giving types to my enviorment variables (env) for type safety using the **_vite-env.d.ts_** file from src in VITE

- The _vite-env.d.ts_ file looks like this for variable VITE_API

```typescript
// src/vite-env.d.ts or vite-env.d.ts in the root (both work)
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly: string; // Declare VITE_API as a string type
}

interface ImportMeta {
  readonly VITE_API: string;
}
```

- The env variables can be used using **_import.meta.env.VITE_API_**

- Also in Vite we don't need dotenv package, Vite handles that itself and env variables should always start with VITE\_ thats a convention
