'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchAndUpdateScore } from '@/actions/round-4'

export default function ScoreManager() {
  const [scores, setScores] = useState<Array<{ user: string; score: number }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateScores = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchAndUpdateScore()
      
      if (result.success) {
        setScores(result.data)
      } else {
        setError(result.error || "")
      }
    } catch (err) {
      setError('Failed to update scores')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Score Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleUpdateScores}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Updating Scores...' : 'Update Scores'}
        </Button>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="space-y-2">
          {scores.map((score, index) => (
            <div 
              key={index}
              className="flex justify-between p-2 bg-muted rounded"
            >
              <span>{score.user}</span>
              <span>{score.score}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

