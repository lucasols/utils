<template>
  <div class="copy-download-buttons">
    <button
      @click="copyMarkdown"
      class="button copy-button"
      :disabled="isLoading"
    >
      <svg v-if="!showCopySuccess" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5H6C5.46957 5 4.96086 5.21071 4.58579 5.58579C4.21071 5.96086 4 6.46957 4 7V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V7C20 6.46957 19.7893 5.96086 19.4142 5.58579C19.0391 5.21071 18.5304 5 18 5H16M8 5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5M8 5C8 5.53043 8.21071 6.03914 8.58579 6.41421C8.96086 6.78929 9.46957 7 10 7H14C14.5304 7 15.0391 6.78929 15.4142 6.41421C15.7893 6.03914 16 5.53043 16 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Copy as Markdown
    </button>

    <button
      @click="copyMarkdownLink"
      class="button link-button"
      :disabled="isLoading"
    >
      <svg v-if="!showLinkSuccess" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.47L11.75 5.18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 11C13.5705 10.4259 13.0226 9.95085 12.3934 9.60706C11.7643 9.26327 11.0685 9.05885 10.3533 9.00771C9.63818 8.95656 8.92041 9.05977 8.24866 9.31035C7.5769 9.56094 6.9669 9.95303 6.46 10.46L3.46 13.46C2.54918 14.403 2.04520 15.6661 2.05660 16.977C2.068 18.288 2.59384 19.5421 3.52088 20.4691C4.44792 21.3962 5.70199 21.922 7.01297 21.9334C8.32395 21.9448 9.58696 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Copy Markdown Link
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const isLoading = ref(false)
const showCopySuccess = ref(false)
const showLinkSuccess = ref(false)

const getMarkdownContent = async (): Promise<string> => {
  try {
    // Get the current page path
    const currentPath = route.path
    
    // Convert the route path to markdown file path
    let markdownPath = currentPath
    if (markdownPath.endsWith('/')) {
      markdownPath = markdownPath.replace(/\/$/, '')
    }
    markdownPath = markdownPath.replace(/\.html$/, '') + '.md'
    
    // Fetch the raw markdown content
    const response = await fetch(markdownPath)
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown: ${response.statusText}`)
    }
    
    return await response.text()
  } catch (error) {
    console.error('Error fetching markdown content:', error)
    throw error
  }
}

const copyMarkdown = async () => {
  if (isLoading.value) return
  
  try {
    isLoading.value = true
    const markdownContent = await getMarkdownContent()
    
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(markdownContent)
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = markdownContent
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    
    showCopySuccess.value = true
    setTimeout(() => {
      showCopySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy markdown:', error)
  } finally {
    isLoading.value = false
  }
}

const copyMarkdownLink = async () => {
  if (isLoading.value) return
  
  try {
    isLoading.value = true
    
    // Get the current page path and convert to markdown URL
    const currentPath = route.path
    let markdownPath = currentPath
    if (markdownPath.endsWith('/')) {
      markdownPath = markdownPath.replace(/\/$/, '')
    }
    markdownPath = markdownPath.replace(/\.html$/, '') + '.md'
    
    // Get the base URL and construct the full markdown URL
    const baseUrl = window.location.origin
    const markdownUrl = baseUrl + markdownPath
    
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(markdownUrl)
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = markdownUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    
    showLinkSuccess.value = true
    setTimeout(() => {
      showLinkSuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy markdown link:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.copy-download-buttons {
  display: flex;
  gap: 12px;
  margin: 16px 0;
  flex-wrap: wrap;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.button:hover:not(:disabled) {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button svg {
  flex-shrink: 0;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .button {
    border-color: var(--vp-c-divider);
  }
  
  .button:hover:not(:disabled) {
    border-color: var(--vp-c-brand);
    background: var(--vp-c-bg-soft);
  }
}
</style>
