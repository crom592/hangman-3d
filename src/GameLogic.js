const words = [
  'APPLE', 'BANANA', 'ORANGE', 'MANGO', 'GRAPE', 'PEACH', 'MELON',
  'CHERRY', 'FIG', 'LEMON', 'LIME', 'OLIVE', 'PLUM', 'PEAR',
  'PINEAPPLE', 'PAPAYA', 'BERRY', 'COCONUT', 'DATE', 'KIWI',
  'WALNUT', 'ALMOND', 'PECAN', 'CASHEW', 'HAZELNUT',
  'PISTACHIO', 'CHESTNUT', 'MACADAMIA', 'PEANUT', 'BRAZIL'
];

const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

const isWordComplete = (word, guessedLetters) => {
  return [...word].every(letter => guessedLetters.includes(letter));
};

const getHiddenWord = (word, guessedLetters) => {
  return [...word].map(letter => (guessedLetters.includes(letter) ? letter : '_')).join(' ');
};

const logSelectedWord = (word) => {
  console.log(`Selected word is: ${word}`);
};

// 게임 초기화 함수 추가
const initializeGame = () => {
  return {
    word: getRandomWord(),
    guessedLetters: [],
    mistakes: 0,
    quizNumber: 1,
    correctCount: 0,
    gameOver: false,
    showGameOverModal: false,
    hasGuessedCorrectly: false,
  };
};

export default {
  getRandomWord,
  isWordComplete,
  getHiddenWord,
  logSelectedWord,
  initializeGame, // 게임 초기화 함수를 내보냅니다.
};
