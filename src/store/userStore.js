import { reactive } from 'vue'

export const userStore = reactive({
  user: JSON.parse(localStorage.getItem('user') || '{}'),
  setUser(user) {
    this.user = user
    localStorage.setItem('user', JSON.stringify(user))
  },
  clearUser() {
    this.user = {}
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
  }
})