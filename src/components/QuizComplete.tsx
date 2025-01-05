"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Trophy, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface QuizCompleteProps {
  score: number;
  onShowLeaderboard: () => void;
  onNextRound: () => void;
}

export function QuizComplete({ score, onShowLeaderboard, onNextRound }: QuizCompleteProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">{score}</p>
            <p className="text-muted-foreground">Total Points</p>
          </div>
          <div className="grid gap-4">
            <Button 
              className="w-full" 
              onClick={onShowLeaderboard}
              variant="outline"
            >
              <Award className="mr-2 h-4 w-4" />
              Reveal Leaderboard
            </Button>
            <Link href="/spidey-sense">
            <Button className="w-full" onClick={onNextRound}>
              Next Round
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}