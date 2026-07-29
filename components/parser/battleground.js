import { Box } from '@chakra-ui/react'

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
  'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
])

// Serialize a parsed node back to raw HTML.
// Unlike the parser's internal serializeNode this also preserves <style> and
// <script> element content (htmlparser2 gives those nodes type 'style'/'script',
// not 'tag'), so the WordPress block's scoped CSS survives intact.
function serialize(node) {
  if (!node) return ''
  if (node.type === 'text') return node.data || ''
  if (node.type === 'comment') return `<!--${node.data}-->`

  if (node.type === 'tag' || node.type === 'style' || node.type === 'script') {
    const name = node.name
    const attrs = Object.entries(node.attribs || {})
      .map(([k, v]) => (v === '' ? k : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
      .join(' ')
    const open = `<${name}${attrs ? ' ' + attrs : ''}>`
    if (VOID_TAGS.has(name)) return open
    const inner = (node.children || []).map(serialize).join('')
    return `${open}${inner}</${name}>`
  }

  return ''
}

// Full-bleed WordPress "Battleground" block.
// The markup is self-contained: it carries its own #lace-blades-battleground
// scoped <style> and a fixed palette, so it is rendered verbatim to reproduce
// the design exactly ("as is"). Because the HTML is a static string, the SSR
// and client markup are identical — no hydration mismatch.
export function WPBattleground({ node }) {
  return (
    <Box width="100%" dangerouslySetInnerHTML={{ __html: serialize(node) }} />
  )
}
