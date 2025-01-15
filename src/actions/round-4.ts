'use server'

import { createAdminClient, getLoggedInUser } from "@/appwrite/config"
import { Query } from "node-appwrite"

interface ScoreData {
  user: string
  score: number
}

export async function fetchAndUpdateScore() {
  try {
    // Fetch scores from the API
    const {db} = await createAdminClient()
    const user = await getLoggedInUser()
    const response = await fetch('https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/LOwAyldXGa2Rle8qWWi7/scores')
    const data = await response.json()
    
    // Process each score
    for (const scoreData of data.result) {
      try {
        // Get user from Appwrite
        const result = await db.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DB!, process.env.NEXT_PUBLIC_APPWRITE_USERS!, [
            Query.equal('id', user?.$id!)
          ]);     
        
        if (result.total > 0) {
          // Update the user's round_4 score
          await db.updateDocument(process.env.NEXT_PUBLIC_APPWRITE_DB!, process.env.NEXT_PUBLIC_APPWRITE_USERS!,result.documents[0].$id, {
            round_4: Math.floor(scoreData.score) // Ensure it's an integer
          })
        }
      } catch (error) {
        console.error(`Error updating score for user ${scoreData.user}:`, error)
      }
    }

    return { success: true, data: data.result }
  } catch (error) {
    console.error('Error fetching or updating scores:', error)
    return { success: false, error: 'Failed to fetch or update scores' }
  }
}

