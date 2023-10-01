import React, { useState, useEffect, useRef,useCallback } from 'react';
import Hangman3D from './Hangman3D';
import GameLogic from './GameLogic';

const GameUI = () => {
  const [showNextButton, setShowNextButton] = useState(false);
  const [word, setWord] = useState(GameLogic.getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [quizNumber, setQuizNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [hasGuessedCorrectly, setHasGuessedCorrectly] = useState(false); // Added to fix the correctCount issue
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);

  const bgmAudioRef = useRef(null);
  const buttonAudioRef = useRef(null);
  const incorrectAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  const loseAudioRef = useRef(null);

  const hiddenWord = GameLogic.getHiddenWord(word, guessedLetters);

  const guessLetter = useCallback((letter) => {
    if (guessedLetters.includes(letter)) return;

    const newGuessedLetters = [...guessedLetters, letter];
    let newMistakes = mistakes;

    if (!word.includes(letter)) {
      incorrectAudioRef.current.play();
      newMistakes++;
    } else {
      buttonAudioRef.current.play();
    }

    setGuessedLetters(newGuessedLetters);
    setMistakes(newMistakes);
  }, [guessedLetters, mistakes, word]);

  const handleButtonClickSound = () => {
    if (buttonAudioRef.current) {
      buttonAudioRef.current.play();
    }
  };

  const toggleBgm = () => {
    if (isBgmPlaying) {
      bgmAudioRef.current.pause();
    } else {
      bgmAudioRef.current.play();
    }
    setIsBgmPlaying(!isBgmPlaying);
  };

  const nextQuiz = () => {
    if (quizNumber < 3) {
      setWord(GameLogic.getRandomWord());
      setGuessedLetters([]);
      setMistakes(0);
      setQuizNumber(quizNumber + 1);
      setShowNextButton(false);
      setShowGameOverModal(false); // 추가: Next Quiz 버튼을 눌렀을 때 모달을 닫습니다.
      setHasGuessedCorrectly(false); // Added to fix the correctCount issue
    } else {
      setGameOver(true);
      setShowNextButton(false);
    }
  };

  const restartGame = () => {
    setWord(GameLogic.getRandomWord());
    setGuessedLetters([]);
    setMistakes(0);
    setQuizNumber(1);
    setCorrectCount(0);
    setGameOver(false);
    setShowGameOverModal(false);
    setHasGuessedCorrectly(false); // Added to fix the correctCount issue
  };

  const handleGameOver = () => {
    // 게임이 끝나지 않았을 때는 모달을 표시하지 않습니다.
    if (quizNumber < 3 && GameLogic.isWordComplete(word, guessedLetters)) {
      return;
    }
    if (GameLogic.isWordComplete(word, guessedLetters)) {
      winAudioRef.current.play();
      document.body.classList.add('celebration');
    } else {
      loseAudioRef.current.play();
      document.body.classList.remove('celebration');
    }
    setShowGameOverModal(true);
  };

  useEffect(() => {
    if (!showModal) {
      toggleBgm();
    }
  }, [showModal]);

  useEffect(() => {
    if (quizNumber > 3) {
      setGameOver(true);
      setShowNextButton(false);
    }
  }, [quizNumber]);

  useEffect(() => {
    if (GameLogic.isWordComplete(word, guessedLetters)) {
      setShowNextButton(true);
      setCorrectCount((prevCount) => prevCount + 1);
    }
  }, [hiddenWord]);  // Only re-run the effect if hiddenWord changes

  useEffect(() => {
    if (mistakes >= 8 || GameLogic.isWordComplete(word, guessedLetters)) {
      handleGameOver();
    }
  }, [mistakes, guessedLetters, word]);

  useEffect(() => {
    if (GameLogic.isWordComplete(word, guessedLetters) || mistakes >= 8) {
      setShowGameOverModal(true);
    }
  }, [mistakes, guessedLetters]);

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];


  
  return (
    <div className="game-container">
      
    {/* Game Over Modal */}
    {showGameOverModal && (
        <div className="modal">
          <div className="modal-content">
            <h1>{GameLogic.isWordComplete(word, guessedLetters) ? "You won!" : "You lost!"}</h1>
            <p>The correct word was: {word}</p>

            {/* 조건에 따라 다른 버튼을 표시 */}
            {quizNumber < 3 && GameLogic.isWordComplete(word, guessedLetters) ? (
              <button className="start-button" onClick={() => {nextQuiz(); handleButtonClickSound();}}>Next Quiz</button>
            ) : (
              <button className="start-button" onClick={() => {restartGame(); handleButtonClickSound();}}>New Game</button>
            )}
          </div>
        </div>
      )}
    {/* Start Game Modal */}
    {showModal && !showGameOverModal && (
      <div className="modal">
        <div className="modal-content">
          <h1>Welcome to the Hangman Game!</h1>
          <button className="start-button" onClick={() => {setShowModal(false); handleButtonClickSound();}}>Start Game</button>
        </div>
      </div>
    )}      
    {/* {showModal && (
        <div className={`modal ${gameOver ? 'game-over-modal' : 'start-modal'}`}>
          <div className="modal-content">
            <h1>{gameOver ? 'Game Over' : 'Welcome to the Hangman Game!'}</h1>
            {gameOver ? (
              <>
                <button className="restart-button" onClick={restartGame}>New Game</button>
                <button className="next-button" onClick={nextQuiz}>Next Game</button>
              </>
            ) : (
              <button className="start-button" onClick={() => setShowModal(false)}>Start Game</button>
            )}
          </div>
        </div>
      )} */}
      {/* BGM Toggle Button */}
      <div className="game-button-container">
      <button className="game-button bgm-button" onClick={() => {toggleBgm(); handleButtonClickSound();}}>
        {isBgmPlaying ? "Pause BGM" : "Play BGM"}
      </button>
      </div>
      {/* Audio Elements */}
      <audio ref={buttonAudioRef} src={process.env.PUBLIC_URL + '/sound/click.m4a'}></audio>
      <audio ref={incorrectAudioRef} src={process.env.PUBLIC_URL + '/sound/wronganswer.mp3'}></audio>
      <audio ref={bgmAudioRef} src={process.env.PUBLIC_URL + '/sound/cute-loop-pink-bunny.mp3'} loop></audio>
      <audio ref={winAudioRef} src={process.env.PUBLIC_URL + '/sound/woohoo.mp3'}></audio>
      <audio ref={loseAudioRef} src={process.env.PUBLIC_URL + '/sound/sad.wav'}></audio>      
      <div className="hangman-container">
        <Hangman3D mistakes={mistakes} />
      </div>
      <div className="info-container">        
        <div className="quiz-number">
          Quiz: {quizNumber} / 3
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
                  disabled={mistakes >= 8}  // Add disabled condition here
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
        {/* {showNextButton && !gameOver && (
          <button className="game-button next-button" onClick={() => {nextQuiz(); handleButtonClickSound();}}>Next Quiz</button>
        )}
        {(gameOver || mistakes >= 8) && (
          <button className="game-button restart-button" onClick={() => {restartGame(); handleButtonClickSound();}}>New Game</button>
        )} */}
      </div>
    </div>
  );
};

export default React.memo(GameUI);
