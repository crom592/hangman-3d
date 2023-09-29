// src/GameLogic.js

import { useState } from "react";
import { words } from "./words";

export const useGameLogic = () => {
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);

  const chooseRandomWords = () => {
    const shuffledWords = [...words].sort(() => 0.5 - Math.random());
    return shuffledWords.slice(0, 3);
  };
  

  const startGame = (chosenWord) => {
    setWord(chosenWord);
    setGuessedLetters([]);
    setMistakes(0);
  };

  const guessLetter = (letter) => {
    if (word.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);
    } else {
      setMistakes(mistakes + 1);
    }
  };
  

  return {
    word,
    guessedLetters,
    mistakes,
    chooseRandomWords,
    startGame,
    guessLetter,
  };
};

