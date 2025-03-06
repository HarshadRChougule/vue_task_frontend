// Simple event bus for global messages
export function showGlobalMessage(text, type = 'info') {
    // Create a custom event
    const event = new CustomEvent('show-message', {
      detail: { text, type }
    });
    
    // Dispatch the event
    window.dispatchEvent(event);
    
    // Also store in sessionStorage for persistence across page reloads
    sessionStorage.setItem('globalMessage', JSON.stringify({ text, type }));
  }
  
  // Function to check for stored messages
  export function checkStoredMessage() {
    const storedMessage = sessionStorage.getItem('globalMessage');
    if (storedMessage) {
      try {
        const { text, type } = JSON.parse(storedMessage);
        // Create a custom event
        const event = new CustomEvent('show-message', {
          detail: { text, type }
        });
        
        // Dispatch the event
        window.dispatchEvent(event);
        
        // Clear the stored message
        sessionStorage.removeItem('globalMessage');
      } catch (error) {
        console.error('Error parsing stored message:', error);
        sessionStorage.removeItem('globalMessage');
      }
    }
  }