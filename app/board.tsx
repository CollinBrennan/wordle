'use client'

import { useState } from 'react'

type Props = {
  wordLength: number
  rows: number
}
export default function Board({ wordLength, rows }: Props) {
  const [board, setBoard] = useState<string[][]>(
    createEmptyBoard(wordLength, rows)
  )

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
