"use client";

import { useState, useEffect } from 'react';
import { QuizCard } from '../../components/QuizCard';
import { QuizTimer } from '../../components/QuizTimer';
import { QuizComplete } from '../../components/QuizComplete';
import { Button } from "../../components/ui/button";
import { getLoggedInUser } from '@/appwrite/config';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getQuiz, updateUser } from '@/actions/quiz';

const QUESTION_TIME = 60; // seconds per question
const MAX_POINTS = 100; // maximum points per question

export interface Question{
  text:string;
  options:string[];
  correct:string;
  isAnswered:boolean;
  isCorrect: boolean;
}

export default function Home() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questions,setQuestions] = useState<Question[]>([])
  const [id,setId] = useState<string>()
  useEffect(()=>{
    getLoggedInUser().then(user=>{
      if(!user) router.push("/login")
      setId(user?.$id)
    })
    getQuiz().then(data=>{
      if(data) setQuestions(data!)
        else alert("Something went wrong")
    })
  },[])

  useEffect(() => {
    if (!quizComplete && !isAnswered && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isAnswered, quizComplete]);

  useEffect(() => {
    if (timeLeft === 0 && !isAnswered) {
      handleNextQuestion();
    }
  }, [timeLeft]);

  const calculatePoints = (timeRemaining: number) => {
    return Math.round((timeRemaining / QUESTION_TIME) * MAX_POINTS);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption) {
      setIsAnswered(true);
      setScore((prev) => prev + calculatePoints(timeLeft));
      if (selectedOption === questions[currentQuestion].correct) {
        setQuestions(prev=>{
          const quiz = prev.map((q,i)=> i==currentQuestion ? {text:questions[currentQuestion].text,correct : questions[currentQuestion].correct
            , options : questions[currentQuestion].options,isCorrect:true,isAnswered:true } : q )
          return quiz
        })
        updateUser(id!,{
          "round_1" : score+calculatePoints(timeLeft),
          "quiz": questions
        })
        toast.success("Correct Answer")
      }else{
        questions[currentQuestion].isAnswered = true
        updateUser(id!,{
          "round_1" : score,
          "quiz": questions
        })
        toast.error("Incorrect Answer. Correct answer is "+questions[currentQuestion].correct)
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(QUESTION_TIME);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      setQuizComplete(true);
    }
  };

  if (quizComplete) {
    return (
      <QuizComplete
        nextRound={'/round-2'}
        score={score}
      />
    );
  }

  return (
    <div
      style={{
        backgroundImage: "url('/img/Earth 65 - spiderverse 1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      className="min-h-screen flex flex-col items-center p-4 space-y-6"
    >
      <ToastContainer />
      <div className="w-full max-w-2xl space-y-6 bg-opacity-80 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">College Quiz Event</h1>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Question {currentQuestion + 1}/{questions.length}</p>
            <p className="font-bold">Score: {score}</p>
          </div>
        </div>

        <QuizTimer timeLeft={timeLeft} maxTime={QUESTION_TIME} />

        {questions.length && currentQuestion < questions.length ? <QuizCard
          question={questions[currentQuestion]}
          selectedOption={selectedOption}
          onSelect={handleOptionSelect}
        /> : "Not found"
        }
        {questions.length && currentQuestion < questions.length && !questions[currentQuestion].isAnswered && selectedOption && (
          <Button className="w-full" onClick={handleSubmitAnswer}>
            Submit Answer
          </Button>
        )}

        {questions.length && currentQuestion < questions.length && questions[currentQuestion].isAnswered && (
          <Button className="w-full" onClick={handleNextQuestion}>
            {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        )}
      </div>
    </div>
  );
}

