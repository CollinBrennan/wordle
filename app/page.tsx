import { fetchWord } from '@/actions'
import Board from './board'

const WORD_LENGTH = 5
const ROWS = 6

export default async function Home() {
  const answer = await fetchWord(WORD_LENGTH)

  return (
    <div>
      <main className="flex flex-col min-h-screen items-center justify-center margin-auto gap-8">
        <h1>Wordle Clone</h1>
        <Board wordLength={WORD_LENGTH} rows={ROWS} answer={answer} />
      </main>
    </div>
  )
}
