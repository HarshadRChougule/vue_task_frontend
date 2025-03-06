// src/plugins/messaging.js
import { ref, readonly } from 'vue'

export const createMessagingSystem = () => {
  const message = ref(null)

  const showMessage = (text, color = 'success', timeout = 3000, location = 'top') => {
    if (!text){
        return // Don't show empty messages
    } 
    
    message.value = { text, color, timeout, location }
    
    // Auto-hide the message after timeout
    setTimeout(() => {
      message.value = null
    }, timeout)
  }

  const clearMessage = () => {
    message.value = null
  }

  return {
    message: readonly(message),
    showMessage,
    clearMessage
  }
}