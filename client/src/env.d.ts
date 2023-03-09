/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_ENDPOINT: string;
  readonly VITE_APP_AXIOS_RETRIES: number;
  readonly VITE_APP_FAKE_API: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}