import React, { useState, useEffect, useRef,useCallback } from 'react';
import Hangman3D from './Hangman3D';
import GameLogic from './GameLogic';
import WORDS_DATA from './words';

const GameUI = () => {
  const [showNextButton, setShowNextButton] = useState(false);
  // const [word, setWord] = useState(GameLogic.getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [quizNumber, setQuizNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [hasGuessedCorrectly, setHasGuessedCorrectly] = useState(false); // Added to fix the correctCount issue
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  // 추가: 카테고리 상태 변수
  const [category, setCategory] = useState(null);
  const [showHintToast, setShowHintToast] = useState(false);
  // 기본 카테고리를 FRUITS로 설정
  const DEFAULT_CATEGORY = 'FRUITS';
  // useState 초기화 부분 수정
const [word, setWord] = useState(GameLogic.getRandomWordFromCategory(DEFAULT_CATEGORY));

  

  const bgmAudioRef = useRef(null);
  const buttonAudioRef = useRef(null);
  const incorrectAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  const loseAudioRef = useRef(null);
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];
  
  const handleKeyPress = (event) => {
    const inputAlphabet = event.key.toUpperCase();

    // 입력한 키가 알파벳인지 확인
    if (/^[A-Z]$/.test(inputAlphabet) && mistakes < 8) {
      guessLetter(inputAlphabet);
    }
  };

  const hiddenWord = GameLogic.getHiddenWord(word, guessedLetters);

  const guessLetter = useCallback((letter) => {
    if (guessedLetters.includes(letter)) return;

    const newGuessedLetters = [...guessedLetters, letter];
    let newMistakes = mistakes;

    if (!word.word.includes(letter)) {
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
      setWord(GameLogic.getRandomWordFromCategory( category ));
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
    setWord(GameLogic.getRandomWordFromCategory(category));
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

   // 카테고리 선택을 위한 함수
   const startGameWithCategory = (selectedCategory) => {
    const wordObj = GameLogic.getRandomWordFromCategory(selectedCategory);
    setWord(wordObj);
    setCategory(selectedCategory);
    setShowModal(false);
    handleButtonClickSound();
  };

  const toggleHintToast = () => {
    setShowHintToast(true);
    setTimeout(() => setShowHintToast(false), 3000); // 3초 후 힌트 메세지 숨김
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
  
  useEffect(() => {
    // 다른 코드와 마찬가지로 useEffect 내에서 다음 내용을 추가합니다.
    window.addEventListener("keydown", handleKeyPress);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [guessedLetters, mistakes]);
  
  return (
    <div className="game-container">
      
    {/* Game Over Modal */}
    {showGameOverModal && (
        <div className="modal">
          <div className="modal-content">
            <h1>{GameLogic.isWordComplete(word, guessedLetters) ? "You won!" : "You lost!"}</h1>
            <p>The correct word was: {word.word}</p>

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
          <p>Select a category to start:</p>
          <select onChange={(e) => startGameWithCategory(e.target.value)}>
            {Object.keys(WORDS_DATA).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {/* <button className="start-button" onClick={() => {setShowModal(false); handleButtonClickSound();}}>Start Game</button> */}
        </div>
      </div>
    )}
    {/* How to Play Modal */}
    {showHowToPlayModal && (
      <div className="modal">
        <div className="modal-content">
          <h1>How to Play</h1>
          <p>
            Welcome to the Hangman Game! 
            Your goal is to guess the word letter by letter. 
        
            For each incorrect guess, a part of the hangman figure is drawn. 
            If the full figure is drawn before you guess the word, you lose. 
            
            Use the on-screen keyboard or your physical keyboard to make guesses. 
            Good luck!
          </p>
          <button className="start-button" onClick={() => setShowHowToPlayModal(false)}>Close</button>
        </div>
      </div>
    )}      
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
      {/* BGM Toggle Button */}
      <div className="game-button-container">
      <button className="game-button how-button" onClick={() => setShowHowToPlayModal(true)}>How to Play</button>
      <button className="game-button bgm-button" onClick={() => {toggleBgm(); handleButtonClickSound();}}>
        {isBgmPlaying ? "Pause BGM" : "Play BGM"}
      </button>
      </div>
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
                  className={`keyboard-button ${guessedLetters.includes(letter.toUpperCase()) ? (word.word.includes(letter.toUpperCase()) ? 'correct' : 'incorrect') : ''}`}
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
        <button className="hint-button" onClick={toggleHintToast}>Show Hint</button>
      {showHintToast && word && <div className="hint-toast">Your hint is: {GameLogic.getHint(word)}</div>}
        {/* 카피라이트 */}
      <div className="copyright">
        &copy; 2023 Hangman3D by Crom. All Rights Reserved.
      </div>
      </div>      
    </div>
  );
};

export default React.memo(GameUI);
