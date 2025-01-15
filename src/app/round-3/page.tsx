import RoundThree from '@/components/RoundThree'
import { Suspense } from 'react'

export default function RoundThreePage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <RoundThree />
    </Suspense>
  )
}

