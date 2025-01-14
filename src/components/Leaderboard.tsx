'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table"
import LeaderboardItem from './LeaderboardItem'

export interface TeamData {
  teamName: string
  roundPoints: number
  totalPoints: number
}

interface LeaderboardProps {
  data: TeamData[]
}

export default function Leaderboard({ data }: LeaderboardProps) {
  const [sortedData, setSortedData] = useState<TeamData[]>([])

  useEffect(() => {
    const sorted = [...data].sort((a, b) => b.totalPoints - a.totalPoints)
    setSortedData(sorted)
  }, [data])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Round Points</TableHead>
              <TableHead>Total Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {sortedData.map((team, index) => (
                <motion.tr
                  key={team.teamName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <LeaderboardItem
                    rank={index + 1}
                    teamName={team.teamName}
                    roundPoints={team.roundPoints}
                    totalPoints={team.totalPoints}
                  />
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

