'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { TOTAL_TIME, INITIAL_POINTS, HINT_COSTS, BLUR_LEVEL, COLORS } from '@/utils/gameUtils'
import { Star, Clock, Zap, Lightbulb } from 'lucide-react';
import { QuizComplete } from './QuizComplete';
import { useRouter } from 'next/navigation';
import { getLoggedInUser } from '@/appwrite/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { startNewGame, validateGuess, getHint } from '@/actions/game-actions';

export default function CharacterGuessGame() {
  const router = useRouter()
  const [points, setPoints] = useState(INITIAL_POINTS);
  const [currentCharacter, setCurrentCharacter] = useState<{ image: string } | undefined>(undefined);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [guess, setGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [deblurredAreas, setDeblurredAreas] = useState<{ x: number, y: number, radius: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuessing, setIsGuessing] = useState(false);
  const [isHinting, setIsHinting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
    
  useEffect(() => {
    getLoggedInUser().then(user => {
      if(!user) router.push("/login")
      else initializeGame();
    })
  }, [])

  const initializeGame = async () => {
    setIsLoading(true);
    try {
      const result = await startNewGame();
      if (result.gameOver) {
        setGameOver(true);
        setPoints(result.points!);
      } else {
        const { currentCharacter, deblurredAreas, hintsUsed, points } = result;
        setCurrentCharacter(currentCharacter);
        setDeblurredAreas(deblurredAreas!);
        setHintsUsed(hintsUsed!);
        setPoints(points!);
      }
    } catch (error) {
      console.error("Failed to start new game:", error);
      toast.error("Failed to start new game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = useCallback(async () => {
    if(!guess.toLowerCase()){
      toast.error("Please enter a guess");
      return;
    }
    
    setIsGuessing(true);
    try {
      const result = await validateGuess(guess);
      if (result.isCorrect) {
        toast.success("Correct Guess!");
      } else {
        toast.error("Wrong answer. Try again!");
      }

      setPoints(result.points);
      setGuess('');
      setHintsUsed(0);
      setDeblurredAreas(result.deblurredAreas || []);
      setTimeLeft(TOTAL_TIME);

      if (result.gameOver) {
        setGameOver(true);
      } else {
        setCurrentCharacter(result.nextCharacter);
      }
    } catch (error) {
      console.error("Error validating guess:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsGuessing(false);
    }
  }, [guess]);

  const handleHint = useCallback(async () => {
    setIsHinting(true);
    try {
      const result = await getHint();
      setPoints(result.points);
      setHintsUsed(result.hintsUsed);
      setDeblurredAreas(result.deblurredAreas);
    } catch (error) {
      console.error("Error getting hint:", error);
      toast.error("Unable to get hint. Try again later.");
    } finally {
      setIsHinting(false);
    }
  }, []);
  

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && !gameOver && !isLoading && !isGuessing && !isHinting) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleGuess();
            return TOTAL_TIME;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameOver, handleGuess, isLoading, isGuessing, isHinting]);

  useEffect(() => {
    if (currentCharacter) {
      const img = new Image();
      img.src = currentCharacter.image;
      img.onload = () => drawImage(img);
    }
  }, [currentCharacter, deblurredAreas]);

  const drawImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    canvas.width = img.width;
    canvas.height = img.height;
  
    ctx.filter = `blur(${BLUR_LEVEL}px)`;
    ctx.drawImage(img, 0, 0);
  
    ctx.filter = 'none';
    deblurredAreas.forEach(area => {
      ctx.save();
      ctx.beginPath();
      ctx.filter = `blur(${10}px)`;
      ctx.arc(area.x * canvas.width / 100, area.y * canvas.height / 100, area.radius * canvas.width / 100, 0, Math.PI * 2);
      ctx.clip();
  
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    });
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGuess();
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[100svh] ${COLORS.background} text-gray-200 p-4`}>
        <h1 className="text-4xl font-bold mb-6 text-center">Loading Game...</h1>
      </div>
    );
  }

  if (gameOver) {
    return (
      <QuizComplete
        nextRound='/'
        score={points}
      />
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-[100svh] ${COLORS.background} text-gray-200 p-4`}>
      <ToastContainer/>
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Guess the Character!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`flex items-center justify-center p-4 rounded-lg bg-secondary`}>
            <Star className="w-6 h-6 mr-2" />
            <span className="text-xl font-semibold">Points: {points}</span>
          </div>
          <div className={`flex items-center justify-center p-4 rounded-lg bg-secondary`}>
            <Clock className="w-6 h-6 mr-2" />
            <span className="text-xl font-semibold">Time: {timeLeft}s</span>
          </div>
          <div className={`flex items-center justify-center p-4 rounded-lg bg-secondary`}>
            <Zap className="w-6 h-6 mr-2" />
            <span className="text-xl font-semibold">Hints Used: {hintsUsed}/3</span>
          </div>
        </div>
        
        <Progress 
          value={(timeLeft / TOTAL_TIME) * 100} 
          className={`h-2 w-full mb-6 bg-primary`}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="relative aspect-square">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain rounded-lg shadow-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
              <Input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter character name"
                className={`flex-grow text-lg p-4 text-gray-200 bg-gray-800 border-gray-700`}
              />
              <Button 
                type="submit"
                className={`bg-primary hover:bg-secondary text-gray-700 text-lg py-4`}
                disabled={isGuessing}
              >
                {isGuessing ? 'Submitting...' : 'Submit Guess'}
              </Button>
            </form>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((hintNumber) => (
                <Button 
                  key={hintNumber}
                  onClick={handleHint} 
                  disabled={hintsUsed >= hintNumber || points < HINT_COSTS[hintNumber - 1] || isHinting}
                  className={`bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground text-sm py-2 disabled:opacity-50`}
                >
                  <Lightbulb className="w-4 h-4 mr-1 tracking-wide" />
                  {isHinting ? 'Loading...' : `Hint ${hintNumber} (-${HINT_COSTS[hintNumber - 1]}p)`}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

