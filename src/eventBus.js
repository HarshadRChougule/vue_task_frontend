import { ref } from 'vue'

export const messageState = ref(null)

export const showGlobalMessage = (text, color = 'success', timeout = 3000, location = 'top') => {
  messageState.value = { text, color, timeout, location }
  
  // Auto-hide after timeout
  setTimeout(() => {
    messageState.value = null
  }, timeout)
}