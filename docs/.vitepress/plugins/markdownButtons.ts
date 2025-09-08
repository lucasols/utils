import type MarkdownIt from 'markdown-it'

/**
 * Custom markdown-it plugin to inject copy/download buttons after the first H1 heading
 */
export function copyDownloadButtonsPlugin(
  md: MarkdownIt,
  componentName: string = 'CopyDownloadButtons'
): void {
  md.core.ruler.push('inject_copy_download_buttons', (state) => {
    const tokens = state.tokens
    let h1Found = false
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      
      // Look for the first H1 heading close tag
      if (token.type === 'heading_close' && token.tag === 'h1' && !h1Found) {
        h1Found = true
        
        // Create a new HTML block token for our component
        const componentToken = new state.Token('html_block', '', 0)
        componentToken.content = `<${componentName} />\n`
        componentToken.block = true
        componentToken.map = token.map
        
        // Insert the component token right after the H1 close tag
        tokens.splice(i + 1, 0, componentToken)
        
        // Break after injecting the first one
        break
      }
    }
    
    return true
  })
}