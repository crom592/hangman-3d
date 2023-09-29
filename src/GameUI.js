import React, { useState, useEffect } from 'react';
import Hangman3D from './Hangman3D';
import GameLogic from './GameLogic';

const GameUI = () => {
  const [showNextButton, setShowNextButton] = useState(false); // 다음 문제 버튼 표시 여부
  const [word, setWord] = useState(GameLogic.getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [problemNumber, setProblemNumber] = useState(1);  // 문제 번호
  const [correctCount, setCorrectCount] = useState(0);  // 정답 수
  
  useEffect(() => {
    if (GameLogic.isWordComplete(word, guessedLetters)) {
      setShowNextButton(true); // 정답을 맞췄을 경우 다음 문제 버튼 표시
      setCorrectCount(correctCount + 1);
    } else if (mistakes >= 8) {
      setShowNextButton(true); // 오류 횟수가 8번 이상일 경우 다음 문제 버튼 표시
    }
  }, [mistakes, guessedLetters, word]);
  const nextProblem = () => {
    // 다음 문제 설정
    setWord(GameLogic.getRandomWord());
    setGuessedLetters([]);
    setMistakes(0);
    setProblemNumber(problemNumber + 1);
    setShowNextButton(false); // 다음 문제 버튼 숨기기
  };
  
  useEffect(() => {
    GameLogic.logSelectedWord(word);  // Log the selected word for debugging
  }, [word]);
  
  useEffect(() => {
    if (mistakes >= 8 || GameLogic.isWordComplete(word, guessedLetters)) {
      alert(GameLogic.isWordComplete(word, guessedLetters) ? "You won!" : "You lost!");
    }
    
  }, [mistakes, guessedLetters, word]);

  const hiddenWord = GameLogic.getHiddenWord(word, guessedLetters);

  const guessLetter = (letter) => {
    // 대문자로 변환
    const upperCaseLetter = letter.toUpperCase();
    
    // 이미 추측한 알파벳 목록에 있으면 리턴
    if (guessedLetters.includes(upperCaseLetter)) return;
    
    // 새로운 추측 알파벳을 목록에 추가
    setGuessedLetters([...guessedLetters, upperCaseLetter]);
    
    // 추측한 알파벳이 단어에 포함되지 않은 경우
    if (!word.includes(upperCaseLetter)) {
      setMistakes(mistakes + 1);
    }
  };
  
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];
  const restartGame = () => {
    setWord(GameLogic.getRandomWord());
    setGuessedLetters([]);
    setMistakes(0);
    // 문제 번호와 정답 수 초기화
    setProblemNumber(1);
    setCorrectCount(0);
  };
  return (
    <div className="game-container">
      <div className="hangman-container">
        <Hangman3D mistakes={mistakes} />
      </div>
      <div className="info-container">
        <div className="problem-number">
          Problem: {problemNumber} / 3
        </div>
        <div className="correct-count">
          Correct: {correctCount}
        </div>
        <div className="hidden-word">
          {hiddenWord}
        </div>
        <div className="alphabet-buttons">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.map((letter) => (
                <button 
                  key={letter} 
                  className={`keyboard-button ${guessedLetters.includes(letter.toUpperCase()) ? (word.includes(letter.toUpperCase()) ? 'correct' : 'incorrect') : ''}`}
                  onClick={() => guessLetter(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="error-count">
          Mistakes: {mistakes}
        </div>
        {showNextButton && (
        <button className="next-button" onClick={nextProblem}>Next Problem</button>
        )}
        { (mistakes >= 8) && (
          <button className="restart-button" onClick={restartGame}>New Game</button>
        )}
      </div>
    </div>
  );
};

export default GameUI;
