import { create } from 'zustand'
import { useNotificationStore } from './notificationStore'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',

  actions: {
    initializeAnecdotes: async () => {
      const response = await fetch('http://localhost:3001/anecdotes')
      const anecdotes = await response.json()

      set({ anecdotes })
    },

    vote: async (id) => {
      const anecdote = useAnecdoteStore
        .getState()
        .anecdotes
        .find((anecdote) => anecdote.id === id)

      const updatedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1
      }

      const response = await fetch(
        `http://localhost:3001/anecdotes/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedAnecdote)
        }
      )

      const savedAnecdote = await response.json()

      set((state) => ({
        anecdotes: state.anecdotes.map((anecdote) =>
          anecdote.id === id ? savedAnecdote : anecdote
        )
      }))

      useNotificationStore
        .getState()
        .actions
        .setNotification(`you voted '${savedAnecdote.content}'`)
    },

    create: async (content) => {
      const newAnecdote = {
        content,
        votes: 0
      }

      const response = await fetch('http://localhost:3001/anecdotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAnecdote)
      })

      const savedAnecdote = await response.json()

      set((state) => ({
        anecdotes: state.anecdotes.concat(savedAnecdote)
      }))

      useNotificationStore
        .getState()
        .actions
        .setNotification('new anecdote created')
    },

    remove: async (id) => {
      await fetch(`http://localhost:3001/anecdotes/${id}`, {
        method: 'DELETE'
      })

      set((state) => ({
        anecdotes: state.anecdotes.filter(
          (anecdote) => anecdote.id !== id
        )
      }))
    },

    setFilter: (value) => set({ filter: value }),
  },
}))

export const useAnecdotes = () =>
  useAnecdoteStore((state) => state.anecdotes)

export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions)

export const useFilter = () =>
  useAnecdoteStore((state) => state.filter)
