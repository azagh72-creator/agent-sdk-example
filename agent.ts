/**
 * Example Agent — @zaghmout/agent-sdk
 *
 * Demonstrates the full guard() flow:
 *   intent → verify → execute → attest → proof
 *
 * Run: npx tsx agent.ts
 */

import { epc1 } from '@zaghmout/agent-sdk';

// ── Simulated on-chain execution ──────────────────────────────────────────────
// In production: replace with your actual DEX swap / contract call.
// Must return a real Stacks txid.
async function executeSwap(): Promise<{ tx_hash: string }> {
  // Real txid from Stacks mainnet (whale-gate-v1 deployment)
  return {
    tx_hash: '3b12575b94b3920a118a4ccf1f71a94b978971d2370a75d37baf0a46bb09291e',
  };
}

// ── Agent ─────────────────────────────────────────────────────────────────────
async function run() {
  const agent = { address: 'SP322ZK4VXT3KGDT9YQANN9R28SCT02MZ97Y24BRW' };
  const intent = { action: 'swap 100 STX → ALEX' };

  console.log('──────────────────────────────────────────');
  console.log('  Flying Whale Agent SDK — Example');
  console.log('──────────────────────────────────────────\n');

  console.log('Intent:', intent.action);
  console.log('Agent: ', agent.address, '\n');

  const result = await epc1.guard(intent, executeSwap, agent);

  if (result.status === 'aborted') {
    console.log('❌ ABORTED');
    console.log('Reason:    ', result.decision.reason ?? 'execution_not_allowed');
    console.log('Confidence:', result.decision.confidence);
    return;
  }

  console.log('✅ EXECUTED + ATTESTED\n');
  console.log('Decision:');
  console.log('  allowed:   ', result.decision.execution_allowed);
  console.log('  confidence:', result.decision.confidence);

  if (result.attest) {
    console.log('\nAttestation:');
    console.log('  attest_id:      ', result.attest.attest_id);
    console.log('  chain_verified: ', result.attest.chain_verified);
    console.log('  tx_status:      ', result.attest.tx_status);
    console.log('  block_height:   ', result.attest.block_height);
    console.log('  signature:      ', result.attest.signature.slice(0, 32) + '...');
    console.log('  proof_url:      ', result.attest.proof_url);
    console.log('  issuer:         ', result.attest.issuer);
  }

  console.log('\n──────────────────────────────────────────');
  console.log('  Verify independently:');
  console.log('  GET', result.attest?.proof_url);
  console.log('──────────────────────────────────────────');
}

run().catch(console.error);
