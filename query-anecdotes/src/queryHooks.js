import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const getAnecdotes = async () => {
  const response = await fetch('http://localhost:3001/anecdotes')
  return response.json()
}

const createAnecdote = async (newAnecdote) => {
  const response = await fetch('http://localhost:3001/anecdotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAnecdote),
  })

  return response.json()
}

const updateAnecdote = async (anecdote) => {
  const response = await fetch(
    `http://localhost:3001/anecdotes/${anecdote.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(anecdote),
    }
  )

  return response.json()
}

export const useAnecdotes = () => {
  return useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
  })
}

export const useCreateAnecdote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })
}

export const useVoteAnecdote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })
}
