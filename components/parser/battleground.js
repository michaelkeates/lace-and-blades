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

// Override that cancels the block's built-in full-bleed breakout
// (position:relative; left:50%; width:100vw !important; margin-left/right:-50vw !important).
//
// The block ships its OWN scoped <style> that sits AFTER this one in the DOM, so
// a single #lace-blades-battleground !important rule here would only tie on
// specificity and LOSE the source-order tiebreak (leaving width:100vw and the
// -50vw margins in place → the block breaks out and gets pulled left). Doubling
// the ID (#lace-blades-battleground#lace-blades-battleground) raises specificity
// above a single-ID !important, so this wins regardless of source order and the
// block collapses to the width of its centered container.
const CONSTRAIN_CSS = `
#lace-blades-battleground#lace-blades-battleground {
  position: relative !important;
  left: auto !important;
  right: auto !important;
  width: 100% !important;
  max-width: 100% !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
`

// WordPress "Battleground" block.
// The markup is self-contained: it carries its own #lace-blades-battleground
// scoped <style> and a fixed palette, so it is rendered verbatim to reproduce
// the design exactly ("as is"). Because the HTML is a static string, the SSR
// and client markup are identical — no hydration mismatch. The block ships a
// full-bleed breakout, which CONSTRAIN_CSS cancels so it stays within the page.
export function WPBattleground({ node }) {
  return (
    <Box width="100%" px={{ base: 0, md: 4 }}>
      <style dangerouslySetInnerHTML={{ __html: CONSTRAIN_CSS }} />
      <Box
        maxW="4xl"
        mx="auto"
        dangerouslySetInnerHTML={{ __html: serialize(node) }}
      />
    </Box>
  )
}
