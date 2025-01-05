export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
  }
  
  export const questions: Question[] = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris"
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars"
    },
    {
      id: 3,
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
      correctAnswer: "Da Vinci"
    },
    {
      id: 4,
      question: "What is the largest mammal in the world?",
      options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      correctAnswer: "Blue Whale"
    },
    {
      id: 5,
      question: "Which element has the chemical symbol 'O'?",
      options: ["Gold", "Silver", "Oxygen", "Iron"],
      correctAnswer: "Oxygen"
    },
    {
      id: 6,
      question: "What is the largest organ in the human body?",
      options: ["Brain", "Heart", "Skin", "Liver"],
      correctAnswer: "Skin"
    },
    {
      id: 7,
      question: "Which country is home to the Great Barrier Reef?",
      options: ["Brazil", "Australia", "India", "Mexico"],
      correctAnswer: "Australia"
    },
    {
      id: 8,
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: "William Shakespeare"
    },
    {
      id: 9,
      question: "What is the square root of 144?",
      options: ["10", "12", "14", "16"],
      correctAnswer: "12"
    },
    {
      id: 10,
      question: "Which year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: "1945"
    }
  ];
  
  