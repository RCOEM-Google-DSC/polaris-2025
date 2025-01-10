"use client";

import { useState, useEffect } from 'react';
import { questions } from '../../lib/questions';
import { QuizCard } from '../../components/QuizCard';
import { QuizTimer } from '../../components/QuizTimer';
import { QuizComplete } from '../../components/QuizComplete';
import { Button } from "../../components/ui/button";

const QUESTION_TIME = 300; // seconds per question
const MAX_POINTS = 100; // maximum points per question

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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
      if (selectedOption === questions[currentQuestion].correctAnswer) {
        setScore((prev) => prev + calculatePoints(timeLeft));
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
        nextRound={'/spidey-sense'}
        score={score}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 space-y-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">College Quiz Event</h1>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Question {currentQuestion + 1}/10</p>
            <p className="font-bold">Score: {score}</p>
          </div>
        </div>
        
        <QuizTimer timeLeft={timeLeft} maxTime={QUESTION_TIME}/>
        
        <QuizCard
          question={questions[currentQuestion]}
          selectedOption={selectedOption}
          onSelect={handleOptionSelect}
          isAnswered={isAnswered}
        />
        
        {!isAnswered && selectedOption && (
          <Button className="w-full" onClick={handleSubmitAnswer}>
            Submit Answer
          </Button>
        )}
        
        {isAnswered && (
          <Button className="w-full" onClick={handleNextQuestion}>
            {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        )}
      </div>
    </div>
  );
}