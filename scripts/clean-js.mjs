// Removes any *.js / *.jsx files from src/ before dev/build.
// The foundation is strictly TS-only; stray .js files break Vite's dep scan
// (e.g. when an old App.js shadows App.tsx via resolve.extensions order).
import { readdirSync, statSync, rmSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = join(fileURLToPath(new URL('..', import.meta.url)), 'src')
const FORBIDDEN = new Set(['.js', '.jsx'])

function walk(dir) {
  let removed = []
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return removed
  }
  for (const name of entries) {
    const full = join(dir, name)
    let s
    try {
      s = statSync(full)
    } catch {
      continue
    }
    if (s.isDirectory()) {
      removed = removed.concat(walk(full))
    } else if (FORBIDDEN.has(extname(name).toLowerCase())) {
      rmSync(full, { force: true })
      removed.push(full)
    }
  }
  return removed
}

const removed = walk(SRC)
if (removed.length > 0) {
  console.log(`[clean-js] removed ${removed.length} stale file(s) from src/:`)
  for (const f of removed) console.log(`  - ${f}`)
}
