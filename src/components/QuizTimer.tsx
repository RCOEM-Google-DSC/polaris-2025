"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";

interface QuizTimerProps {
  timeLeft: number;
  maxTime: number;
}

export function QuizTimer({ timeLeft, maxTime }: QuizTimerProps) {
  const progress = (timeLeft / maxTime) * 100;
  
  return (
    <div className="w-full space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-center text-sm text-muted-foreground">
        Time remaining: {timeLeft} seconds
      </p>
    </div>
  );
}