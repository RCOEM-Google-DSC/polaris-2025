"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Question } from '../lib/questions';
import { QuizOption } from './QuizOption'

interface QuizCardProps {
  question: Question;
  selectedOption: string | null;
  onSelect: (answer: string) => void;
  isAnswered: boolean;
}

export function QuizCard({ question, selectedOption, onSelect, isAnswered }: QuizCardProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Question {question.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option) => (
            <QuizOption
              key={option}
              option={option}
              isSelected={selectedOption === option}
              isAnswered={isAnswered}
              onSelect={(option) => {
                if (selectedOption === option) {
                  onSelect(''); // Unselect if clicking the same option
                } else {
                  onSelect(option); // Select new option
                }
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}