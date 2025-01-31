// src/vite-env.d.ts or vite-env.d.ts in the root (both work)
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly: string; // Declare VITE_API as a string type
}

interface ImportMeta {
  readonly VITE_GITHUB_API_TOKEN: string;
}
