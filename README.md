# Private AI Rating Board (FHEVM)

Confidential rating dApp on Zama FHEVM. Users submit 1–5 ratings as encrypted values on-chain. The contract stores
encrypted sum and count; averages are revealed client‑side with user decryption (EIP‑712).

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

## Deploy

Set Hardhat vars for Sepolia:

```bash
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
```

Deploy:

```bash
npx hardhat --network sepolia deploy
```

## Tasks (local)

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

- Paste Rating Item Address
- Click Grant Read Access
- Select 1–5 → Rate Now
- Click Decrypt to view sum/count/avg

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
