import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL('../public/' + path, import.meta.url), 'utf8');
const page = read('phantom-course.html');
const source = read('phantom-course/sample-contract.sol');
const course = path => JSON.parse(read('phantom-course/' + path));

test('the practice and original scanner reports identify the source students download', () => {
  const sha = createHash('sha256').update(source).digest('hex');
  const practice = course('sample-report.json');
  const native = course('sentinel-report.json');

  assert.equal(practice.inspected_files[0].sha256, sha);
  assert.equal(native.files[0].sha256, sha);
  assert.equal(practice.findings.length, 2);
  assert.equal(native.summary.findings, 0);
  assert.equal(native.summary.files_scanned, 1);
  assert.equal(native.summary.coverage_complete, true);
  assert.equal(practice.coverage_complete, false);
});

test('every displayed source line agrees with the original, including line numbers', () => {
  const excerpt = Array.from(page.matchAll(/<i aria-hidden="true">(\d+)<\/i><code>([^<]*)<\/code>/g));
  assert.equal(excerpt.length, 12);
  const lines = source.split('\n');
  for (const [, number, displayed] of excerpt) {
    const original = lines[Number(number) - 1];
    assert.equal(displayed, original.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'));
  }
});

test('both site entries point to the course and every relative asset exists', () => {
  for (const path of ['phantom.html', 'x3-academy.html']) {
    assert.ok(read(path).includes('href="phantom-course.html"'));
  }
  for (const [, path] of page.matchAll(/(?:src|href)="(phantom-course\/[^"#?]+|phantom\.html)"/g)) {
    assert.ok(read(path).length > 0, path);
  }
  assert.match(page, /mailto:[^"?]+\?subject=PHANTOM/);
});
