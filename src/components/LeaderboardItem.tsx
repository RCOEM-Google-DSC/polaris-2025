import { motion } from 'framer-motion'
import { TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy } from 'lucide-react'

interface LeaderboardItemProps {
  rank: number
  teamName: string
  roundPoints: number
  totalPoints: number
}

export default function LeaderboardItem({
  rank,
  teamName,
  roundPoints,
  totalPoints,
}: LeaderboardItemProps) {
  return (
    <>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {rank <= 3 && (
            <Trophy className={`w-5 h-5 ${rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : 'text-amber-600'}`} />
          )}
          <span className={`text-lg ${rank <= 3 ? 'font-bold' : ''}`}>{rank}</span>
        </div>
      </TableCell>
      <TableCell className="font-semibold">{teamName}</TableCell>
      <TableCell>
        <Badge variant="secondary">{roundPoints}</Badge>
      </TableCell>
      <TableCell className="font-bold text-primary">{totalPoints}</TableCell>
    </>
  )
}

