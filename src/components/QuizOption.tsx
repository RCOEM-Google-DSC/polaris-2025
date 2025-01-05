"use client";

import { Button } from "../components/ui/button";

interface QuizOptionProps {
  option: string;
  isSelected: boolean;
  isAnswered: boolean;
  onSelect: (option: string) => void;
}

export function QuizOption({ option, isSelected, isAnswered, onSelect }: QuizOptionProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className={`w-full text-left justify-start h-auto py-4 px-6 ${
        isSelected ? "bg-primary text-primary-foreground" : ""
      }`}
      onClick={() => !isAnswered && onSelect(option)}
      disabled={isAnswered}
    >
      {option}
    </Button>
  );
}