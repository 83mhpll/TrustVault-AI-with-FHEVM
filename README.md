# AI Rating (FHEVM)

A private 1–5 star rating dApp powered by Zama FHEVM.

- Users rate AI models with encrypted votes on-chain
- Smart contract stores encrypted sum and count only (no plaintext)
- Reveal Average decrypts the aggregate client‑side via Zama Relayer (EIP‑712)

## Project Overview

AI Rating Board lets users give confidential 1–5 star ratings to AI models. Individual ratings are never revealed; only
the encrypted sum and count are stored on-chain. Users can later "Enable Reveal" and verify the average via client-side
decryption with the Zama relayer using EIP‑712 signatures.

Key points:

- Fully homomorphic encryption (FHE) on Zama FHEVM
- Encrypted state types `euint32` for `sum` and `count`
- Access control for ciphertexts via FHE ACL
- Frontend: React (Vite) + Wagmi/RainbowKit; seamless wallet UX
- Model Catalog, search, sorting, and quick rating with a wallet popup

## Requirements

- Node.js 20+
- npm 7+
- Sepolia (for real encrypted tests)

## Install

```bash
npm install
```

## Compile (mock)

```bash
npm run compile
```

## Deploy (Sepolia)

Set Hardhat vars for Sepolia:

```bash
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
```

Deploy:

```bash
npx hardhat --network sepolia deploy
```

## Tasks (local quick test)

```bash
npx hardhat node
npx hardhat --network localhost deploy
# Create rating item
npx hardhat --network localhost rating:create --name "Demo Model" --desc "First item"
# Rate 1..5
npx hardhat --network localhost rating:rate --item <RatingItem> --score 5
# Decrypt sum/count → avg
npx hardhat --network localhost rating:decrypt --item <RatingItem>
```

## Web UI

```bash
cd web
npm install
npm run dev
```

Open Local URL and:

- Paste a Rating Item Address (or create one and paste its address)
- Click Enable Reveal once (allow decrypt of aggregates)
- Select 1–5 → Rate Now (wallet signs and sends on Sepolia)
- Optional: Reveal Average later; only the aggregate is shown

### Model Catalog

- Loads from `web/public/models.json` by default
- To use a remote list without redeploying, set `web/.env`:

```bash
VITE_MODELS_URL=https://your-domain/models.json
```

- Catalog supports search and quick sort tabs (Trending / Top rated / Most rated). Use Select to choose a model for
  rating.

## Deployed Demo (fill before submission)

- Live demo URL: https://ai-rating-board-l7cuz2n4a-83mhplls-projects.vercel.app
- Network: Sepolia (11155111)

### Deployed Contracts

- RatingFactory: 0x45Fba25A3Eea1d0f3A7f43B3939CF93F83bE8795
- RatingItem(s):
  - 0xFA6A70E59D0A816C6D99a28a46E607566813B183 — Model: GPT-4o

## Submission Checklist (Developer Program)

- [ ] End‑to‑end demo deployed (frontend + Sepolia contracts)
- [ ] README includes how to run locally and on Sepolia
- [ ] At least one RatingItem address is provided for testing
- [ ] Short screencast (optional but recommended) linked in README
- [ ] Tests for core contract logic (factory createItem, item rate + average)
- [ ] Clear description of confidentiality (what’s encrypted vs public)
- [ ] Screenshots in README (UI + tx flow)
- [ ] License and acknowledgements

## How this meets the Program Criteria

- Confidential compute: votes encrypted on‑chain; only aggregate revealed via Relayer (EIP‑712)
- Working demo: React (Vite) UI with wallet connect, Enable Reveal, Rate Now, Model Catalog
- Completeness: Contracts + frontend + docs; tasks to deploy and test provided
- Usability: Clean Zama‑themed UI; faucet link; network switch; searchable catalog

## Contributing / Dev Notes

- RPC fallback configured; set `VITE_SEPOLIA_RPC_URL` for a private RPC
- To update models, edit `web/public/models.json` or point to `VITE_MODELS_URL`

### Known Rating Items (Sepolia)

Paste one of these into the “Rating Item Address” field on the site to start rating immediately:

```
# Paste any of these into the site to start rating
0xFA6A70E59D0A816C6D99a28a46E607566813B183  # GPT-4o
```

## Project Structure

```
contracts/
  RatingItem.sol        # sum, count (euint32), clamp 1..5, ACL
  RatingFactory.sol     # create item + metadata
  PrivateVote*.sol      # legacy example kept for reference
deploy/deploy.ts        # deploy FHECounter, PrivateVote, Factories
tasks/Rating.ts         # rating:create/rate/decrypt
web/                    # UI
```

## Notes

- Uses relayer SDK (EIP-712 user decrypt) to reveal sum/count
- Keep only one wallet extension active to avoid `window.ethereum` conflicts

## References

- Zama FHEVM, Hardhat Plugin, relayer SDK — docs: `https://docs.zama.ai`
