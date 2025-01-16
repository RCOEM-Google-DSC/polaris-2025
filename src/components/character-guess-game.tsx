"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  TOTAL_TIME,
  INITIAL_POINTS,
  HINT_COSTS,
  BLUR_LEVEL,
  COLORS,
} from "@/utils/gameUtils";
import { Star, Clock, Zap, Lightbulb } from 'lucide-react';
import { QuizComplete } from "./QuizComplete";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/appwrite/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { startNewGame, validateGuess, getHint } from "@/actions/game-actions";

interface Character {
  image: string;
}

interface DeblurredArea {
  x: number;
  y: number;
  radius: number;
}

export default function CharacterGuessGame() {
  const router = useRouter();
  const [points, setPoints] = useState<number>(INITIAL_POINTS);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedTime = localStorage.getItem('timeLeft');
      return savedTime ? parseInt(savedTime, 10) : TOTAL_TIME;
    }
    return TOTAL_TIME;
  });
  const [guess, setGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [deblurredAreas, setDeblurredAreas] = useState<DeblurredArea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuessing, setIsGuessing] = useState<boolean>(false);
  const [isHinting, setIsHinting] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    getLoggedInUser().then((user) => {
      if (!user) router.push("/login");
      else initializeGame();
    });
  }, []);

  const initializeGame = async () => {
    setIsLoading(true);
    try {
      const result = await startNewGame();
      if (result.gameOver) {
        setGameOver(true);
        setPoints(result.points ?? INITIAL_POINTS);
      } else {
        const { currentCharacter, deblurredAreas, hintsUsed, points } = result;
        setCurrentCharacter(currentCharacter ?? null);
        setDeblurredAreas(deblurredAreas ?? []);
        setHintsUsed(hintsUsed ?? 0);
        setPoints(points ?? INITIAL_POINTS);
      }
    } catch (error) {
      console.error("Failed to start new game:", error);
      toast.error("Failed to start new game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = useCallback(async () => {
    if (!guess.toLowerCase()) {
      toast.error("Please enter a guess");
      return;
    }

    setIsGuessing(true);
    try {
      const result = await validateGuess(guess);
      if (result.isCorrect) {
        toast.success("Correct Guess!");
        if (typeof window !== 'undefined') {
          localStorage.setItem('timeLeft', TOTAL_TIME.toString());
        }
      } else {
        toast.error("Oops! Wrong answer.");
      }

      setPoints(result.points ?? points);
      setGuess("");
      setHintsUsed(0);
      setDeblurredAreas(result.deblurredAreas ?? []);
      setTimeLeft(TOTAL_TIME);

      if (result.gameOver) {
        setGameOver(true);
      } else {
        setCurrentCharacter(result.nextCharacter ?? null);
      }
    } catch (error) {
      console.error("Error validating guess:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsGuessing(false);
    }
  }, [guess, points]);

  const handleHint = useCallback(async () => {
    setIsHinting(true);
    try {
      const result = await getHint();
      setPoints(result.points ?? points);
      setHintsUsed(result.hintsUsed ?? hintsUsed);
      setDeblurredAreas(result.deblurredAreas ?? deblurredAreas);
    } catch (error) {
      console.error("Error getting hint:", error);
      toast.error("Unable to get hint. Try again later.");
    } finally {
      setIsHinting(false);
    }
  }, [points, hintsUsed, deblurredAreas]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timeLeft > 0 && !gameOver && !isLoading && !isGuessing && !isHinting) {
      timer = setInterval(() => {
        setTimeLeft((prevTime: number) => {
          const newTime = prevTime <= 1 ? TOTAL_TIME : prevTime - 1;
          if (typeof window !== 'undefined') {
            localStorage.setItem('timeLeft', newTime.toString());
          }
          if (newTime === TOTAL_TIME) {
            clearInterval(timer);
            handleGuess();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameOver, handleGuess, isLoading, isGuessing, isHinting]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('timeLeft');
      }
    };
  }, []);

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

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.filter = `blur(${BLUR_LEVEL}px)`;
    ctx.drawImage(img, 0, 0);

    ctx.filter = "none";
    deblurredAreas.forEach((area) => {
      ctx.save();
      ctx.beginPath();
      ctx.filter = `blur(${10}px)`;
      const increasedRadius = (area.radius * canvas.width) / 100 * 1.5;
      ctx.arc(
        (area.x * canvas.width) / 100,
        (area.y * canvas.height) / 100,
        increasedRadius,
        0,
        Math.PI * 2
      );
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
    return <QuizComplete nextRound="/" score={points} />;
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-[100svh] bg-[#241743] text-gray-200 p-4`}>
      <ToastContainer />
      <div className="w-full max-w-4xl">
        <img
          src="/img/upperpic.png"
          alt="Header Image"
          className="w-full h-auto mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`flex items-center justify-center p-4 rounded-xl bg-[#D00242]`}>
            <Star className="w-6 h-6 mr-2" />
            <span className="text-xl font-semibold">Points: {points}</span>
          </div>
          <div className={`flex items-center justify-center p-4 rounded-xl bg-[#D00242]`}>
            <Clock className="w-6 h-6 mr-2" />
            <span className="text-xl font-semibold">Time: {timeLeft}s</span>
          </div>
          <div className={`flex items-center justify-center p-4 rounded-xl bg-[#D00242]`}>
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
          <div className="flex flex-col justify-center bg-[#D00242] rounded-3xl">
            <h1 className="text-7xl font-bold text-center mb-4">HELLO</h1>
            <h1 className="text-2xl font-bold text-center mb-4">my name is </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4 px-4">
              <Input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                className={`flex-grow text-lg p-4 text-black bg-white border-white h-32 rounded-3xl text-center`}
              />
              <Button
                type="submit"
                className={`bg-primary text-black text-lg border-white rounded-2xl`}
                disabled={isGuessing}
              >
                {isGuessing ? "Submitting..." : "Submit"}
              </Button>
            </form>
            <div className="grid grid-cols-3 gap-2 px-4">
              {[1, 2, 3].map((hintNumber) => (
                <Button
                  key={hintNumber}
                  onClick={handleHint}
                  disabled={
                    hintsUsed >= hintNumber ||
                    points < HINT_COSTS[hintNumber - 1] ||
                    isHinting
                  }
                  className={`bg-yellow-500 hover:bg-yellow-300 hover:text-white text-black text-sm py-2 disabled:opacity-50 rounded-xl`}
                >
                  <Lightbulb className="w-4 h-4 mr-1 tracking-wide" />
                  {isHinting
                    ? "Loading..."
                    : `Hint ${hintNumber} (-${HINT_COSTS[hintNumber - 1]}p)`}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <img
            src="/img/lowerpic.png"
            alt="Footer Image"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}