'use server'

import { databases, client } from '@/lib/appwrite-server'
import { Query } from 'node-appwrite'

export async function fetchUsers() {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_APPWRITE_DB!,
      process.env.NEXT_APPWRITE_USERS!,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]
    )

    return response.documents.map(doc => ({
      teamName: doc.name,
      totalPoints: doc.round_1 + doc.round_2 + doc.round_3 + doc.round_4,
      round1Points: doc.round_1,
      round2Points: doc.round_2,
      round3Points: doc.round_3,
      round4Points: doc.round_4,
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export async function subscribeToUsers() {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  client.subscribe(`databases.YOUR_DATABASE_ID.collections.users.documents`, (response) => {
    const { events, payload } = response
    writer.write(encoder.encode(`data: ${JSON.stringify({ type: events[0], payload })}\n\n`))
  })

  return readable
}

