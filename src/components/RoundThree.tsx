'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Countdown from 'react-countdown'
import { updateUserScore } from '@/actions/round-3'
import { getLoggedInUser } from '@/appwrite/config'
import { set } from 'date-fns'

export default function RoundThree() {
  const [startTime, setStartTime] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const initializeRound = async () => {
      const storedStartTime = localStorage.getItem('roundThreeStartTime')
      const storedUserId = localStorage.getItem('userId')
      if (storedStartTime && storedUserId) {
        setStartTime(parseInt(storedStartTime, 10))
        setUserId(storedUserId)
      } else {
        const now = Date.now()
        setStartTime(now)
        localStorage.setItem('roundThreeStartTime', now.toString())
        // In a real application, you'd get the user ID from your auth system
        getLoggedInUser().then((user)=>{
          if (!user) return
          setUserId(user.$id)
          localStorage.setItem('userId', user.$id)
        })
        // setUserId(newUserId)
      
      }
    }

    initializeRound()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`https://www.hackerrank.com/rest/contests/spidercraft-test/leaderboard?offset=0&limit=10&_=${Date.now()}`,
      // {
      //   method: 'GET',
      //   headers: {
      //     'Access-Control-Allow-Origin': '*',
      //   }
      // }
    )
      const data = await response.json()
      const currentUserScore = data.models.find((model: any) => model.hacker === 'singhaditya4')?.score || 5
      setScore(currentUserScore)
      if (userId) {
        await updateUserScore(userId, currentUserScore)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  const handleComplete = () => {
    localStorage.removeItem('roundThreeStartTime')
    localStorage.removeItem('userId')
    router.push('/leaderboard')
  }

  const renderer = ({ minutes, seconds, completed }: { minutes: number, seconds: number, completed: boolean }) => {
    if (completed) {
      return <div className="text-4xl font-bold">Time's up! Final score: {score}</div>
    } else {
      return (
        <div className="text-6xl font-bold">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
      )
    }
  }

  if (!startTime) return <div className="text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center bg-[url('/spiderweb-background.jpg')] bg-cover bg-center">
      <div className="bg-blue-900 bg-opacity-80 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-8">Round 3</h1>
        <Countdown
          date={startTime + 40 * 60 * 1000}
          renderer={renderer}
          onComplete={handleComplete}
          onTick={() => {
            if (Date.now() - startTime! >= 1 * 60 * 1000) {
              fetchLeaderboard()
            }
          }}
        />
        <div className="mt-8 text-2xl">Current Score: {score}</div>
        {startTime && Date.now() - startTime >= 40 * 60 * 1000 && (
          <div className="mt-8">
            <a href="/leaderboard" className="text-xl text-blue-300 hover:text-blue-100 underline">
              View Leaderboard
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

