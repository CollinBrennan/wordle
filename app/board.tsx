'use client'

import { useEffect, useState } from 'react'

type Props = {
  wordLength: number
  rows: number
  answer: string
}
export default function Board({ wordLength, rows, answer }: Props) {
  const [board, setBoard] = useState<string[][]>(
    createEmptyBoard(wordLength, rows)
  )

  const currentSquare = { row: 0, col: 0 }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.key)
      const {row, col} = currentSquare
      if (isLetter(event.key)) {
        updateBoard(row, col, event.key.toLowerCase())
        if (col < wordLength - 1) currentSquare.col += 1
        else if (row < rows - 1) {
          currentSquare.row += 1
          currentSquare.col = 0
        }
      } 
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const updateBoard = (row: number, col: number, value: string) => {
    setBoard(prev => {
      const newBoard = [...prev]
      newBoard[row][col] = value
      return newBoard
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {board.map((row) => (
        <div className="flex gap-4">
          {row.map((letter) => (
            <div className="border-2 border-white size-12">{letter}</div>
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

function isLetter(string: string) {
  return /^[a-zA-z]$/.test(string)
}