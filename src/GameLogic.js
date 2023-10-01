const words = [
  'APPLE', 'BANANA', 'ORANGE', 'MANGO', 'GRAPE', 'PEACH', 'MELON',
  'CHERRY', 'FIG', 'LEMON', 'LIME', 'OLIVE', 'PLUM', 'PEAR',
  'PINEAPPLE', 'PAPAYA', 'BERRY', 'COCONUT', 'DATE', 'KIWI',
  'WALNUT', 'ALMOND', 'PECAN', 'CASHEW', 'HAZELNUT',
  'PISTACHIO', 'CHESTNUT', 'MACADAMIA', 'PEANUT', 'BRAZIL'
];

export default {
  getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  },
  isWordComplete(word, guessedLetters) {
    return [...word].every(letter => guessedLetters.includes(letter));
  },
  getHiddenWord(word, guessedLetters) {
    return [...word].map(letter => (guessedLetters.includes(letter) ? letter : '_')).join(' ');
  },
  logSelectedWord(word) {
    console.log(`Selected word is: ${word}`);
  }
};
