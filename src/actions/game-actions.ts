"use server";

import { createAdminClient, getLoggedInUser } from "@/appwrite/config";
import { Query } from "node-appwrite";
import { v4 as uuidv4 } from "uuid";

const characters = [
  { name: "vemon", image: "img/venom.jpg" },
  { name: "mysterio", image: "img/img2.jpeg" },
  { name: "goblin", image: "img/img3.jpeg" },
  { name: "sandman", image: "img/img4.jpeg" },
  { name: "rhino", image: "img/img5.jpg" },
  { name: "doctor octopus", image: "img/img6.jpg" },
  { name: "prowler", image: "img/img7.jpg" },
  { name: "hammerhead", image: "img/img8.jpg" },
  { name: "electro", image: "img/img9.jpg" },
  { name: "spiderman", image: "img/img10.jpg" },
  { name: "mj", image: "img/img11.jpeg" },
];

type DeblurredArea = {
  x: number;
  y: number;
  radius: number;
};

type GameState = {
  characters: { name: string; image: string; guessed: boolean }[];
  currentIndex: number;
  points: number;
  hintsUsed: number;
  deblurredAreas: DeblurredArea[];
};

export const startNewGame = async () => {
  const { db } = await createAdminClient();
  const user = await getLoggedInUser();

  if (!user) {
    throw new Error("User not logged in");
  }

  const userData = await db.getDocument(
    process.env.NEXT_APPWRITE_DB!,
    process.env.NEXT_APPWRITE_USERS!,
    user.$id
  );

  if (userData.gameState) {
    const gameState: GameState = JSON.parse(userData.gameState);
    // Check if all characters have been guessed
    if (gameState.characters.every((char) => char.guessed)) {
      // If all characters have been guessed, the game is over
      return {
        gameOver: true,
        points: gameState.points,
      };
    } else {
      // Find the next unguessed character
      gameState.currentIndex = gameState.characters.findIndex(
        (char) => !char.guessed
      );

      await db.updateDocument(
        process.env.NEXT_APPWRITE_DB!,
        process.env.NEXT_APPWRITE_USERS!,
        user.$id,
        { gameState: JSON.stringify(gameState) }
      );

      return {
        currentCharacter: {
          image: gameState.characters[gameState.currentIndex].image,
        },
        deblurredAreas: gameState.deblurredAreas,
        hintsUsed: gameState.hintsUsed,
        points: gameState.points,
      };
    }
  } else {
    // If no game state exists, create a new one
    const shuffledCharacters = [...characters]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((char) => ({ ...char, guessed: false }));
    const gameState: GameState = {
      characters: shuffledCharacters,
      currentIndex: 0,
      points: 1000,
      hintsUsed: 0,
      deblurredAreas: [],
    };

    await db.updateDocument(
      process.env.NEXT_APPWRITE_DB!,
      process.env.NEXT_APPWRITE_USERS!,
      user.$id,
      { gameState: JSON.stringify(gameState) }
    );

    return {
      currentCharacter: {
        image: gameState.characters[gameState.currentIndex].image,
      },
      deblurredAreas: gameState.deblurredAreas,
      hintsUsed: gameState.hintsUsed,
      points: gameState.points,
    };
  }
};

export const validateGuess = async (guess: string) => {
  const { db } = await createAdminClient();
  const user = await getLoggedInUser();

  if (!user) {
    throw new Error("User not logged in");
  }

  const userData = await db.getDocument(
    process.env.NEXT_APPWRITE_DB!,
    process.env.NEXT_APPWRITE_USERS!,
    user.$id
  );

  const gameState: GameState = JSON.parse(userData.gameState);
  const currentCharacter = gameState.characters[gameState.currentIndex];
  gameState.characters[gameState.currentIndex].guessed = true;
  const isCorrect = guess.toLowerCase() === currentCharacter.name.toLowerCase();

  if (isCorrect) {
    gameState.points += 20;
    currentCharacter.guessed = true;
  } else {
    gameState.points = Math.max(0, gameState.points - 5);
    currentCharacter.guessed = true;
  }

  // Find the next unguessed character
  const nextUnguessedIndex = gameState.characters.findIndex(
    (char, index) => index > gameState.currentIndex && !char.guessed
  );

  if (nextUnguessedIndex !== -1) {
    gameState.currentIndex = nextUnguessedIndex;
    gameState.hintsUsed = 0;
    gameState.deblurredAreas = [];

    await db.updateDocument(
      process.env.NEXT_APPWRITE_DB!,
      process.env.NEXT_APPWRITE_USERS!,
      user.$id,
      { gameState: JSON.stringify(gameState) }
    );
    return {
      isCorrect,
      points: gameState.points,
      nextCharacter: {
        image: gameState.characters[gameState.currentIndex].image,
      },
      deblurredAreas: [],
      gameOver: false,
    };
  } else {
    // All characters have been guessed
    console.log(gameState);
    await db.updateDocument(
      process.env.NEXT_APPWRITE_DB!,
      process.env.NEXT_APPWRITE_USERS!,
      user.$id,
      { round_2: gameState.points, gameState: JSON.stringify(gameState) }
    );
    return { isCorrect, points: gameState.points, gameOver: true };
  }
};

export const getHint = async () => {
  const { db } = await createAdminClient();
  const user = await getLoggedInUser();

  if (!user) {
    throw new Error("User not logged in");
  }

  const userData = await db.getDocument(
    process.env.NEXT_APPWRITE_DB!,
    process.env.NEXT_APPWRITE_USERS!,
    user.$id
  );

  const gameState: GameState = JSON.parse(userData.gameState);
  const hintCost = [30, 50, 80][gameState.hintsUsed];

  if (gameState.points < hintCost) {
    throw new Error("Not enough points for hint");
  }

  if (gameState.hintsUsed >= 3) {
    throw new Error("Maximum hints used");
  }

  gameState.points -= hintCost;
  gameState.hintsUsed++;

  // Generate a new deblurred area
  const newDeblurredArea: DeblurredArea = {
    x: Math.random() * 100, // Assuming 100% width
    y: Math.random() * 100, // Assuming 100% height
    radius: Math.random() * 20 + 10, // Random radius between 10 and 30
  };

  gameState.deblurredAreas.push(newDeblurredArea);

  await db.updateDocument(
    process.env.NEXT_APPWRITE_DB!,
    process.env.NEXT_APPWRITE_USERS!,
    user.$id,
    { gameState: JSON.stringify(gameState) }
  );

  return {
    points: gameState.points,
    hintsUsed: gameState.hintsUsed,
    deblurredAreas: gameState.deblurredAreas,
  };
};

export const getQuiz = async () => {
  try {
    const { db } = await createAdminClient();
    const user = await getLoggedInUser();

    if (!user) {
      throw new Error("User not logged in");
    }

    const data = await db.listDocuments(
      process.env.NEXT_APPWRITE_DB!,
      process.env.NEXT_APPWRITE_USERS!,
      [Query.equal("id", user.$id)]
    );

    const quiz = data.documents[0].quiz.map((q: any) => ({
      id: q.$id,
      text: q.text,
      options: q.options,
      isAnswered: q.isAnswered,
      isCorrect: q.isCorrect,
    }));

    console.log(quiz);
    return quiz;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return [];
  }
};
