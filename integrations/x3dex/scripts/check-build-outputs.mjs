import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

for (const [relative, prefix] of [
  ['../../../public/dex-terminal/', '/dex-terminal/'],
  ['../dist/', '/'],
]) {
  const directory = new URL(relative, import.meta.url)
  const html = readFileSync(new URL('index.html', directory), 'utf8')
  const urls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1])
  assert.ok(urls.length >= 3, 'Expected favicon, JavaScript and CSS assets')
  for (const url of urls) {
    assert.ok(url.startsWith(prefix), `${relative}: unexpected asset base ${url}`)
    const asset = new URL(url.slice(prefix.length), directory)
    assert.ok(asset.href.startsWith(directory.href), 'Asset must stay in output directory')
    assert.ok(existsSync(asset), `${relative}: missing asset ${url}`)
  }
  console.log(`PASS ${relative}: ${urls.length} assets exist under ${prefix}`)
}
