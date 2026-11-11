import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

test('Explorer vendor bytes match their documented source hash and pinned upstream link', () => {
  const documentation = readFileSync(new URL('../src/lib/explorer/README.md', import.meta.url), 'utf8');
  const source = readFileSync(new URL('../src/lib/explorer/client.mjs', import.meta.url));
  const commit = documentation.match(/Source commit: `([a-f0-9]{40})`/);
  const digest = documentation.match(/SHA-256: `([a-f0-9]{64})`/);
  assert.ok(commit, 'record an exact upstream commit, not only a mutable branch');
  assert.ok(digest, 'record the vendored client hash');
  assert.equal(createHash('sha256').update(source).digest('hex'), digest[1]);
  assert.ok(documentation.includes(
    `https://github.com/Cyptopimpinainteazy/x3lang/blob/${commit[1]}/x3-lang/near/explorer/client.mjs`,
  ));
});
