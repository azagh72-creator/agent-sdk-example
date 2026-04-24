# Agent SDK Example

> Execution Control Plane for AI Agents — [FW_ETL_v1.0](https://fwgate.to)

Nothing is considered executed unless **fwgate.to** attests it.

## Install

```bash
npm install @zaghmout/agent-sdk
```

## Usage

```typescript
import { epc1 } from '@zaghmout/agent-sdk'

const result = await epc1.guard(
  { action: 'swap 100 STX → ALEX' },
  async () => {
    // your execution here — must return real tx_hash
    const tx = await executeSwap()
    return { tx_hash: tx.txid }
  },
  { address: 'SP322...' }
)

if (result.status === 'aborted') {
  console.log('Blocked:', result.decision.reason)
}

if (result.status === 'executed') {
  console.log('Proof:', result.attest.proof_url)
  // https://fwgate.to/epc/v1/attest/fw-attest-...
}
```

## What happens inside guard()

```
intent
  ↓
POST /epc/v1/evaluate    ← EPC-1 decision (execution_allowed + confidence)
  ↓ (if allowed)
your fn()                ← actual execution
  ↓
POST /epc/v1/attest      ← chain verification + Ed25519 signature
  ↓
AttestRecord             ← non-forgeable proof, persisted in Redis
```

## Verify independently

```bash
# Get attestation
curl https://fwgate.to/epc/v1/attest/<attest_id>

# Live chain re-check
curl https://fwgate.to/epc/v1/verify/<attest_id>

# Public key for signature verification
curl https://fwgate.to/epc/v1/pubkey
```

## Run this example

```bash
npm install
npm start
```

---

**Flying Whale** · [fwgate.to](https://fwgate.to) · zaghmout.btc · ERC-8004 #54
