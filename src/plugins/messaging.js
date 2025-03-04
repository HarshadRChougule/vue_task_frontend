import { ref,readonly } from "vue";

export const createMessagingSystem = ()=>{
    const message = ref('');
    const showMessage = (text, color='success',timeout=3000,location = 'top')=>{
        message.value = {text,color,timeout,location};
        setTimeout(()=>{
            message.value=null
        },timeout)
    }

    return {
        message: readonly(message),
        showMessage
    }
}

