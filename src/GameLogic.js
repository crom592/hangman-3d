import WORDS_DATA from './words';

export default {
  getRandomWordFromCategory(category) {
    const wordsFromCategory = WORDS_DATA[category];
    const randomIndex = Math.floor(Math.random() * wordsFromCategory.length);
    return wordsFromCategory[randomIndex];
  },
  isWordComplete(wordObj, guessedLetters) {
    return [...wordObj.word].every(letter => guessedLetters.includes(letter));
  },
  getHiddenWord(wordObj, guessedLetters) {
    return [...wordObj.word].map(letter => (guessedLetters.includes(letter) ? letter : '_')).join(' ');
  },
  getHint(wordObj) {
    return wordObj.hint;
  }
};
