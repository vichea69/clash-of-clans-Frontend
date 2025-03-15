/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_COC_API_TOKEN: string
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 