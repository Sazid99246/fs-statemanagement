import { render, screen, act, cleanup } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import AnecdoteList from './AnecdoteList'
import {
  useAnecdotes,
  useAnecdoteActions,
} from '../store'

const testAnecdotes = [
  {
    id: '1',
    content: 'Low votes anecdote',
    votes: 1,
  },
  {
    id: '2',
    content: 'High votes anecdote',
    votes: 10,
  },
  {
    id: '3',
    content: 'Middle votes anecdote',
    votes: 5,
  },
]

beforeEach(() => {
  vi.restoreAllMocks()
  cleanup()
})

afterEach(() => {
  cleanup()
})

describe('Anecdotes store and component', () => {
  // Exercise 14
  it('initializes anecdotes with data returned by the backend', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(testAnecdotes),
    })

    const actions = renderHook(() => useAnecdoteActions())
    const anecdotes = renderHook(() => useAnecdotes())

    await act(async () => {
      await actions.result.current.initializeAnecdotes()
    })

    expect(anecdotes.result.current).toEqual(testAnecdotes)
  })

  // Exercise 15
  it('displays anecdotes sorted by votes', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(testAnecdotes),
    })

    const actions = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await actions.result.current.initializeAnecdotes()
    })

    render(<AnecdoteList />)

    const high = screen.getByText('High votes anecdote')
    const middle = screen.getByText('Middle votes anecdote')
    const low = screen.getByText('Low votes anecdote')

    expect(
      high.compareDocumentPosition(middle) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()

    expect(
      middle.compareDocumentPosition(low) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  // Exercise 16
  it('displays only anecdotes matching the filter', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue([
        {
          id: '1',
          content: 'React is great',
          votes: 3,
        },
        {
          id: '2',
          content: 'Zustand is simple',
          votes: 5,
        },
        {
          id: '3',
          content: 'React testing is useful',
          votes: 7,
        },
      ]),
    })

    const actions = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await actions.result.current.initializeAnecdotes()
    })

    render(<AnecdoteList />)

    await act(async () => {
      actions.result.current.setFilter('react')
    })

    expect(screen.getByText('React is great')).toBeTruthy()
    expect(screen.getByText('React testing is useful')).toBeTruthy()
    expect(screen.queryByText('Zustand is simple')).toBeNull()
  })

  // Exercise 17
  it('voting increases the number of votes for an anecdote', async () => {
    const initialAnecdote = {
      id: '1',
      content: 'Test voting anecdote',
      votes: 3,
    }

    const updatedAnecdote = {
      ...initialAnecdote,
      votes: 4,
    }

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(updatedAnecdote),
    })

    const actions = renderHook(() => useAnecdoteActions())
    const anecdotes = renderHook(() => useAnecdotes())

    // Initialize the store
    globalThis.fetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue([initialAnecdote]),
    })

    await act(async () => {
      await actions.result.current.initializeAnecdotes()
    })

    // The next fetch is the PUT request made by vote()
    globalThis.fetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(updatedAnecdote),
    })

    await act(async () => {
      await actions.result.current.vote('1')
    })

    expect(anecdotes.result.current).toEqual([updatedAnecdote])
    expect(anecdotes.result.current[0].votes).toBe(4)
  })
})
