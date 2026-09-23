import { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm.jsx'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter.jsx'
import { useAnecdoteActions } from './store'
import Notification from './components/Notification.jsx'


const App = () => {
  const { initializeAnecdotes } = useAnecdoteActions()

  useEffect(() => {
    initializeAnecdotes()
  }, [initializeAnecdotes])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
