"use server"

export async function fetchWord(wordLength: number): Promise<string> {
    const response = await fetch(`https://random-word-api.vercel.app/api?words=1&length=${wordLength}`)
    const words = await response.json()

    return words[0]
}