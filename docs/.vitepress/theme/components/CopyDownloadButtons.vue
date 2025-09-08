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
      @click="downloadMarkdown"
      class="button download-button"
      :disabled="isLoading"
    >
      <svg v-if="!showDownloadSuccess" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Download as Markdown
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const isLoading = ref(false)
const showCopySuccess = ref(false)
const showDownloadSuccess = ref(false)

const getMarkdownContent = async (): Promise<string> => {
  try {
    // Get the current page path
    const currentPath = route.path
    
    // Convert the route path to markdown file path
    let markdownPath = currentPath
    if (markdownPath.endsWith('/')) {
      markdownPath += 'index'
    }
    markdownPath += '.md'
    
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

const downloadMarkdown = async () => {
  if (isLoading.value) return
  
  try {
    isLoading.value = true
    const markdownContent = await getMarkdownContent()
    
    // Create filename from current path
    const currentPath = route.path
    let filename = currentPath.split('/').filter(Boolean).join('-')
    if (!filename) {
      filename = 'index'
    }
    filename += '.md'
    
    // Create blob and download
    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
    
    showDownloadSuccess.value = true
    setTimeout(() => {
      showDownloadSuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to download markdown:', error)
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