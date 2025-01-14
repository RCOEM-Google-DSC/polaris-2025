'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "../components//ui/button"
import { Input } from "../components/ui/input"
import { Progress } from "../components/ui/progress"
import { TOTAL_TIME, INITIAL_POINTS, HINT_COSTS, BLUR_LEVEL, getRandomCharacters, COLORS, BLUR_HEIGHT, BLUR_WIDTH } from '../utils/gameUtils'
import { Star, Clock, Zap, Lightbulb } from 'lucide-react';
import { QuizComplete } from './QuizComplete';
import { useRouter } from 'next/navigation';
import { getLoggedInUser } from '@/appwrite/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CharacterGuessGame() {
  const router = useRouter()
  const [points, setPoints] = useState(INITIAL_POINTS);
  const [characters, setCharacters] = useState(getRandomCharacters(5));
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [guess, setGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [deblurredAreas, setDeblurredAreas] = useState<{ x: number, y: number, radius: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentCharacter = characters[currentCharacterIndex];
    
  useEffect(()=>{
      getLoggedInUser().then(user=>{
        if(!user) router.push("/login")
      })
    },[])  
  const handleNextCharacter = useCallback(() => {
    if (currentCharacterIndex < characters.length - 1) {
      setCurrentCharacterIndex((prevIndex) => prevIndex + 1);
      setHintsUsed(0);
      setDeblurredAreas([]);
      setTimeLeft(TOTAL_TIME);
    } else {
      setGameOver(true);
    }
  }, [currentCharacterIndex, characters.length]);

  const handleGuess = useCallback(() => {
    if(!guess.toLowerCase()){
      alert("Enter Something")
      return
    }
    if (guess.toLowerCase() === currentCharacter.name.toLowerCase()) {
      setPoints((prevPoints) => prevPoints + 20);
      toast.success("Correct Guess")
    } else {
      setPoints((prevPoints) => Math.max(0, prevPoints - 5));
      toast.error("Wrong answer. Character is "+currentCharacter.name)
    }
    setGuess('');
    handleNextCharacter();
  }, [guess, currentCharacter, handleNextCharacter]);

  const handleHint = useCallback(() => {
    if (hintsUsed < HINT_COSTS.length && points >= HINT_COSTS[hintsUsed]) {
      setPoints((prevPoints) => prevPoints - HINT_COSTS[hintsUsed]);
      setHintsUsed((prevHints) => prevHints + 1);
      
      const canvas = canvasRef.current;
      if (canvas) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        // Increase the radius for the deblurred area
        const radius = Math.random() * 50 + 150; // Larger radius, range 150-200
        setDeblurredAreas((prev) => [...prev, { x, y, radius }]);
      }
    }
  }, [hintsUsed, points]);
  

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleNextCharacter();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameOver, handleNextCharacter]);

  useEffect(() => {
    const img = new Image();
    img.src = currentCharacter.image;
    img.onload = () => drawImage(img);
  }, [currentCharacter, deblurredAreas]);

  const drawImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    // Set canvas dimensions to match the image
    canvas.width = img.width;
    canvas.height = img.height;
  
    // Draw the fully blurred image
    ctx.filter = `blur(${BLUR_LEVEL}px)`;
    ctx.drawImage(img, 0, 0);
  
    // Remove blur in the deblurred areas
    ctx.filter = 'none';
    deblurredAreas.forEach(area => {
      ctx.save();
      ctx.beginPath();
      ctx.filter = `blur(${10}px)`;
      // Define the deblurred area
      ctx.arc(area.x, area.y, area.radius, 0, Math.PI * 5);
      ctx.clip();
  
      // Redraw the unblurred portion of the image
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    });
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGuess();
  };

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
            <span className="text-xl font-semibold">Character: {currentCharacterIndex + 1}/5</span>
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
              >
                Submit Guess
              </Button>
            </form>
            <div className="grid grid-cols-3 gap-2">
              {HINT_COSTS.map((cost, index) => (
                <Button 
                  key={index}
                  onClick={handleHint} 
                  disabled={index !== hintsUsed || points < cost}
                  className={`bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground text-sm py-2 disabled:opacity-50`}
                >
                  <Lightbulb className="w-4 h-4 mr-1 tracking-wide" />
                  Hint {index + 1} (-{cost}p)
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

