import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import {
  useAnecdotes,
  useCreateAnecdote,
  useVoteAnecdote,
} from './queryHooks'

const App = () => {
  const result = useAnecdotes()
  const newAnecdoteMutation = useCreateAnecdote()
  const voteMutation = useVoteAnecdote()

  if (result.isPending) {
    return <div>loading...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  const addAnecdote = (event) => {
    event.preventDefault()

    const content = event.target.anecdote.value

    newAnecdoteMutation.mutate({
      content,
      votes: 0,
    })

    event.target.anecdote.value = ''
  }

  const handleVote = (anecdote) => {
    voteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1,
    })
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />

      <AnecdoteForm addAnecdote={addAnecdote} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>

          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
