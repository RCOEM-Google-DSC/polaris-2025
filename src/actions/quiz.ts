"use server"

import { createAdminClient, getLoggedInUser } from "@/appwrite/config"
import { Query } from "node-appwrite";

export const validate = async (id:string,selected:string) => {
    try {
        const {account,db} = await createAdminClient()
        const quiz = await db.getDocument(
            process.env.NEXT_APPWRITE_DB!,
            process.env.NEXT_APPWRITE_QUIZ!,
            id
        )
        if(quiz.correct==selected)return {correct:true,message:quiz.correct}
        else return {correct:false,message:quiz.correct}
    } catch (error) {
        console.log(error)
        return {
            error:"error"
        }
    }
}
export const getQuiz = async () => {
    try {
    const {account,db} = await createAdminClient()
    const user = await getLoggedInUser()
    if(!user)
        return
    const data = await db.listDocuments(
        process.env.NEXT_APPWRITE_DB!,
        process.env.NEXT_APPWRITE_USERS!,
        [
            Query.equal("id",user?.$id),
        ]
    )
    const quiz = data.documents[0].quiz.map((q:any)=>{
        return {
            id: q.$id,
            text : q.text,
            options : q.options,
            isAnswered : q.isAnswered,
            isCorrect: q.isCorrect,
            correct: q.correct
        }
    })
    console.log(quiz);
    return quiz
    } catch (error) {
        console.log(error)
        return []
    }
}

// @ts-ignore
export const updateUser = async (qid:string,data,uid:string,points:number) => {
    try {
        const {account,db} = await createAdminClient()
        const quiz = await db.updateDocument(
            process.env.NEXT_APPWRITE_DB!,
            process.env.NEXT_APPWRITE_QUIZ!,
            qid,
            data
        )  
        const user = await db.updateDocument(
            process.env.NEXT_APPWRITE_DB!,
            process.env.NEXT_APPWRITE_USERS!,
            uid,
            {
                round_1:points
            }
        ) 
        console.log("Success");
        return {"success":true}
    } catch (error) {
        console.log(error)
        return {"success":false}
    }
  
}

