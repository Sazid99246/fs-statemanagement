import { useRef } from 'react'
import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { create } = useAnecdoteActions()
  const inputRef = useRef()

  const addAnecdote = (event) => {
    event.preventDefault()

    const content = inputRef.current.value

    create(content)

    inputRef.current.value = ''
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addAnecdote}>
        <div>
          <input ref={inputRef} data-testid="new" />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
