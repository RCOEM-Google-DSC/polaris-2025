'use server'

import { createAdminClient } from '@/appwrite/config';
import { Query } from 'node-appwrite';

export async function updateUserScore(userId: string, score: number) {
  try {
    const {db} = await createAdminClient()
    const result = await db.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DB!, process.env.NEXT_PUBLIC_APPWRITE_USERS!, [
      Query.equal('id', userId)
    ]);     

    if (result.documents.length > 0) {
      await db.updateDocument(process.env.NEXT_PUBLIC_APPWRITE_DB!, process.env.NEXT_PUBLIC_APPWRITE_USERS!,result.documents[0].$id, {
        round_3: score
      });
      return { success: true };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error updating user score:', error);
    return { success: false, error: 'Failed to update score' };
  }
}

