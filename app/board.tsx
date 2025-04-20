"use client"

import { useEffect, useRef, useState } from "react"

enum Status {
  ABSENT,
  PRESENT,
  EXACT,
}

type Props = {
  wordLength: number
  rows: number
  answer: string
}

export default function Board({ wordLength, rows, answer }: Props) {
  const [board, setBoard] = useState<string[][]>(
    createEmptyBoard(wordLength, rows)
  )
  const [boardStatus, setBoardStatus] = useState<Status[][]>(
    createEmptyBoardStatus(wordLength, rows)
  )
  const [gameIsOver, setGameIsOver] = useState(false)
  const [guessIsCorrect, setGuessIsCorrect] = useState(false)

  const square = useRef({ row: 0, col: 0 })

  const charMap = createCharMap(answer)

  useEffect(() => {
    console.log(answer)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameIsOver) {
        if (isLetter(event.key)) addLetter(event.key)
        if (event.key === "Backspace") removeLetter()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [gameIsOver])

  const addLetter = (letter: string) => {
    const { row, col } = square.current
    const newBoard = [...board]
    newBoard[row][col] = letter
    setBoard(newBoard)

    if (col === wordLength - 1) {
      updateBoardStatus(row, newBoard[row])
      if (row < rows - 1) {
        square.current.row += 1
        square.current.col = 0
      } else {
        setGameIsOver(true)
      }
    } else {
      square.current.col += 1
    }
  }

  const removeLetter = () => {
    const { row, col } = square.current
    if (col > 0) {
      square.current.col -= 1
      const newBoard = [...board]
      newBoard[row][square.current.col] = ""
      setBoard(newBoard)
    }
  }

  const updateBoardStatus = (rowIndex: number, row: string[]) => {
    const map = { ...charMap }
    const statusRow: Status[] = []

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

    setBoardStatus((prev) => {
      const newBoardStatus = [...prev]
      newBoardStatus[rowIndex] = statusRow
      return newBoardStatus
    })

    const gameIsOver = row.join("") === answer
    setGameIsOver(gameIsOver)
    setGuessIsCorrect(gameIsOver)
  }

  return (
    <div>
      <h2 className={`pb-4 text-center ${!gameIsOver ? "invisible" : ""}`}>
        {guessIsCorrect ? "Congragulations!" : "Sorry, game over!"}
        <br />
        The word was '{answer}'
      </h2>
      <div className="flex flex-col gap-4">
        {board.map((row, i) => (
          <div key={i} className="flex gap-4">
            {row.map((letter, j) => (
              <div
                key={j}
                style={{
                  backgroundColor: getBackgroundColor(boardStatus[i][j]),
                }}
                className="border-2 border-white size-12"
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function createEmptyBoard(wordLength: number, rows: number): string[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: wordLength }, () => "")
  )
}

function createEmptyBoardStatus(wordLength: number, rows: number): Status[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: wordLength }, () => Status.ABSENT)
  )
}

function isLetter(string: string) {
  return /^[a-zA-Z]$/.test(string)
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
  if (status === Status.EXACT) return "green"
  else if (status === Status.PRESENT) return "yellow"
  else return "gray"
}
