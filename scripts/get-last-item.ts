import { ethers } from "hardhat";

async function main() {
  const factoryArg = process.env.FACTORY || process.argv.find((a) => a.startsWith("0x"));
  if (!factoryArg) {
    throw new Error(
      "Missing factory address. Usage: FACTORY=0x... npx hardhat run --network sepolia scripts/get-last-item.ts",
    );
  }

  const factoryAddress = factoryArg as `0x${string}`;

  const abi = [
    "function getItemsCount() view returns (uint256)",
    "function getItem(uint256 id) view returns (address item, address creator, uint8 min, uint8 max, string name, string description)",
  ];

  const provider = ethers.provider;
  const factory = new ethers.Contract(factoryAddress, abi, provider);

  const count: bigint = await factory.getItemsCount();
  console.log("itemsCount:", count.toString());

  if (count === 0n) {
    console.log("No items yet.");
    return;
  }

  const lastId = count - 1n;
  const itemRes = await factory.getItem(lastId);
  const itemAddress: string = itemRes[0];
  const creator: string = itemRes[1];
  const min: number = Number(itemRes[2]);
  const max: number = Number(itemRes[3]);
  const name: string = itemRes[4];
  const description: string = itemRes[5];

  console.log("lastId:", lastId.toString());
  console.log("item:", itemAddress);
  console.log("creator:", creator);
  console.log("bounds:", `${min}..${max}`);
  console.log("name:", name);
  if (description) console.log("description:", description);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
