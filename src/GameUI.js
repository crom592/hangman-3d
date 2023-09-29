import React, { useState } from 'react';
import Hangman3D from './Hangman3D';

const GameUI = () => {
  // Dummy game logic hooks; replace these with your actual game logic
  const [word] = useState("HANGHAE");  // setWord removed
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);

  // Update hidden word display
  const hiddenWord = word.split('')
                          .map((letter) => guessedLetters.includes(letter) ? letter : '_')
                          .join(' ');

  const guessLetter = (letter) => {
    setGuessedLetters([...guessedLetters, letter]);

    if (word.includes(letter)) {
      // Correct guess
    } else {
      // Incorrect guess
      setMistakes(mistakes + 1);
    }
  };

  return (
    <div className="game-container">
      <div className="hangman-container">
        <Hangman3D mistakes={mistakes} />
      </div>
      <div className="info-container">
        <div className="hidden-word">
          {hiddenWord}
        </div>
        <div className="alphabet-buttons">
          {'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => (
            <button 
              key={letter} 
              className={guessedLetters.includes(letter) ? 'incorrect' : ''}
              onClick={() => guessLetter(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="error-count">
          Mistakes: {mistakes}
        </div>
      </div>
    </div>
  );
  
  
};

export default GameUI;
