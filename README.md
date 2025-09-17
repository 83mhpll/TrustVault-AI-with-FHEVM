# FHEVM PrivateVote dApp

โครงการตัวอย่าง dApp โหวตแบบเข้ารหัสบน FHEVM ประกอบด้วย:
- สัญญาอัจฉริยะ `PrivateVote.sol` (Solidity)
- งานทดสอบ Hardhat พร้อม FHEVM plugin
- งาน `tasks/*` เพื่อโต้ตอบสัญญา
- เว็บ UI (Vite + React + Wagmi + relayer SDK)

## คุณสมบัติหลัก
- โหวตแบบส่วนตัวด้วย `externalEuint32`
- เก็บยอดนับเป็นค่าที่เข้ารหัส (handle)
- อนุญาตอ่าน/ถอดรหัสแบบเลือกบุคคล (`FHE.allow`, `allowAllTo`)
- Decrypt ฝั่งผู้ใช้ผ่าน relayer SDK (user decrypt + EIP-712)

## เตรียมเครื่องมือ
- Node.js 20+
- npm 7+
- Sepolia (สำหรับทดสอบแบบเข้ารหัสจริง)

## ติดตั้ง
```bash
npm install
```

## คอมไพล์และทดสอบ (mock encryption)
```bash
npm run compile
npm test
```

## ดีพลอย
ตั้งค่า Hardhat vars หากจะใช้ Sepolia:
```bash
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
```
ดีพลอย:
```bash
npx hardhat --network sepolia deploy
```

## ใช้งานผ่าน Task
ตัวอย่างบนโหนดโลคอล:
```bash
# รันโหนด
npx hardhat node
# ดีพลอย
npx hardhat --network localhost deploy
# ดูที่อยู่
npx hardhat --network localhost task:pv:address
# โหวต (index 1)
npx hardhat --network localhost task:pv:vote --index 1
# ถอดรหัสค่าทุกตัวเลือก
npx hardhat --network localhost task:pv:decrypt-all
```

## เว็บ UI
ดู `web/README.md` สำหรับขั้นตอนอย่างย่อ:
```bash
cd web
npm install
npm run dev
```
เปิดลิงก์ Local ในเทอร์มินัล จากนั้น:
- Connect วอลเล็ตบน Sepolia
- ใส่ที่อยู่สัญญา `PrivateVote`
- กด Grant Read Access หนึ่งครั้ง
- Decrypt tallies และลอง Vote

## โครงสร้างโปรเจกต์
```
contracts/PrivateVote.sol     # สัญญาโหวตแบบเข้ารหัส
tasks/PrivateVote.ts          # คำสั่งโต้ตอบ (deploy, vote, decrypt)
test/PrivateVote.ts           # ชุดทดสอบ mock FHEVM
web/                          # เว็บ UI
```

## หมายเหตุ
- โค้ด Solidity ผ่านการจัดรูปแบบและตรวจลินต์ด้วย Solhint แล้ว
- เลี่ยงการใช้หลายวอลเล็ตพร้อมกันในเบราว์เซอร์ (เหลือแค่ตัวเดียว)

## อ้างอิง
- FHEVM Solidity, Hardhat Plugin และ Relayer SDK โดย Zama
- เอกสารตัวอย่างและแนวทาง: `https://docs.zama.ai`
