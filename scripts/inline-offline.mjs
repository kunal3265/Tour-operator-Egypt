// Makes dist-offline/client/index.html self-contained. A file:// page cannot
// load ES modules, so the built script is inlined as one classic script at the
// end of <body>, and the stylesheet is inlined into the head. Only the
// photographs stay as nearby files.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('../dist-offline/client/', import.meta.url))
let html = readFileSync(join(dir, 'index.html'), 'utf8')
let script = ''

html = html.replace(/<script[^>]*src="\.\/assets\/([^"]+\.js)"[^>]*><\/script>/, (_m, file) => {
  const js = readFileSync(join(dir, 'assets', file), 'utf8').replace(/<\/script/gi, '<\/script')
  script = `<script>\n${js}\n</script>`
  return ''
})

html = html.replace(/<link[^>]*href="\.\/assets\/([^"]+\.css)"[^>]*>/, (_m, file) => {
  return `<style>\n${readFileSync(join(dir, 'assets', file), 'utf8')}\n</style>`
})

if (!script) throw new Error('no built script found to inline')
if (html.includes('src="./assets/') || html.includes('href="./assets/')) {
  throw new Error('offline html still references external assets')
}

// Function replacements keep `$&`, `$1` and friends inside the bundle literal.
html = html.replace('</body>', () => `${script}\n</body>`)
writeFileSync(join(dir, 'index.html'), html)
console.log('inlined offline build into dist-offline/client/index.html')
