/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly NEWSLETTER_S1_TOKEN: string
}
  
interface ImportMeta {
	readonly env: ImportMetaEnv
}
