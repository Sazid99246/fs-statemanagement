import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  message: '',

  actions: {
    setNotification: (message) => {
      set({ message })

      setTimeout(() => {
        set({ message: '' })
      }, 5000)
    },
  },
}))

export const useNotification = () => useNotificationStore((state) => state.message)

export const useNotificationActions = () => useNotificationStore((state) => state.actions)
