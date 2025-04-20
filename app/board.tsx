'use client'

import { useEffect, useRef, useState } from 'react'

enum Status {
  ABSENT,
  PRESENT,
  EXACT
}

type Props = {
  wordLength: number
  rows: number
  answer: string
}

export default function Board({ wordLength, rows, answer }: Props) {
  const [board, setBoard] = useState<string[][]>(createEmptyBoard(wordLength, rows))
  const [boardStatus, setBoardStatus] = useState<Status[][]>(createEmptyBoardStatus(wordLength, rows))

  const square = useRef({row: 0, col: -1})

  const charMap = createCharMap(answer)

  useEffect(() => {
    console.log(answer)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isLetter(event.key)) addletter(event.key)
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const {row, col} = square.current
    if (col === wordLength - 1) {
      updateBoardStatus(row)
      if (row < rows - 1) {
        square.current.row += 1
        square.current.col = 0
      }

    } else {
      square.current.col += 1
    }
  }, [board])

  const addletter = (letter: string) => {
    const {row, col} = square.current
    updateBoard(row, col, letter)
  }

  const updateBoard = (row: number, col: number, value: string) => {
    setBoard(prev => {
      const newBoard = [...prev]
      newBoard[row][col] = value
      return newBoard
    })
  }

  const updateBoardStatus = (rowIndex: number) => {
    const map = {...charMap}
    const statusRow: Status[] = []
    const row = board[rowIndex]
    for (let i = 0; i < row.length; i++) {
      const letter = row[i]
      if (map[letter] && map[letter] > 0) {
        if (letter === answer[i]) statusRow.push(Status.EXACT)
        else statusRow.push(Status.PRESENT)
        
        map[letter] -= 1
      } else {
        statusRow.push(Status.ABSENT)
      }
    }

    setBoardStatus(prev => {
      const newBoardStatus = [...prev]
      newBoardStatus[rowIndex] = statusRow
      return newBoardStatus
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {board.map((row, i) => (
        <div className="flex gap-4">
          {row.map((letter, j) => (
            <div style={{backgroundColor: getBackgroundColor(boardStatus[i][j])}} className="border-2 border-white size-12">{letter}</div>
          ))}
        </div>
      ))}
    </div>
  )
}

function createEmptyBoard(wordLength: number, rows: number): string[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: wordLength }, () => '')
  )
}

function createEmptyBoardStatus(wordLength: number, rows: number): Status[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: wordLength }, () => Status.ABSENT)
  )
}

function isLetter(string: string) {
  return /^[a-zA-z]$/.test(string)
}

function createCharMap(chars: string) {
  const map: Record<string, number> = {}
  for (let char of chars) {
    if (map[char]) {
      map[char] += 1
    } else {
      map[char] = 1
    }
  }

  return map
}

function getBackgroundColor(status: Status): string {
  if (status === Status.EXACT) return 'green'
  else if (status === Status.PRESENT) return 'yellow'
  else return 'gray'
}