import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = name => readFileSync(new URL('../public/'+name,import.meta.url),'utf8');
test('ecosystem HUD derives node count from the actual protocol inventory',()=>{
  const html=read('index.html');
  assert.match(html, /id="nv">—<\/span>/);
  assert.match(html,/document\.getElementById\('nv'\)\.textContent\s*=\s*PROTOCOLS\.length/);
});
test('PHANTOM navigation has an accessible name',()=>{
  assert.match(read('phantom.html'),/<nav aria-label="X3 websites">[\s\S]*?<a href="https:\/\/dotx3\.net">DotX3<\/a>[\s\S]*?<\/nav>/);
});
test('PHANTOM security link uses high-contrast dedicated CTA',()=>{
  assert.match(read('x3-security.html'),/\.btn-phantom\{background:#6ef0d0;color:#04040a\}/);
  assert.match(read('x3-security.html'),/class="btn btn-phantom" href="https:\/\/www\.x3star\.net\/phantom\.html"/);
});
