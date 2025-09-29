/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SEPOLIA_RPC_URL: string
  readonly VITE_ALCHEMY_API_KEY: string
  readonly VITE_INFURA_API_KEY: string
  readonly VITE_PRIVATE_VOTE_ADDRESS: string
  readonly VITE_RATING_FACTORY_ADDRESS: string
  readonly VITE_ZAMA_RELAYER_URL: string
  readonly VITE_SEPOLIA_FAUCET_URL: string
  readonly VITE_MODELS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
