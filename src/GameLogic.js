export default class GameLogic {
  static words = [
    "apple", "banana", "cherry", "date", "elephant", "flamingo", "grape",
    "honey", "iguana", "jaguar", "kangaroo", "lemon", "mongoose", "nectarine",
    "ostrich", "peach", "quokka", "raspberry", "strawberry", "tiger", 
    "umbrella", "vulture", "walrus", "xylophone", "yak", "zebra", 
    "octopus", "narwhal", "lemur", "koala", "jellyfish"
  ];
  static logSelectedWord(word) {
    console.log(`Selected Word: ${word}`);
  }
  static getRandomWord() {
    return this.words[Math.floor(Math.random() * this.words.length)].toUpperCase();
  }

  static isWordComplete(word, guessedLetters) {
    return word.split('').every((letter) => guessedLetters.includes(letter));
  }

  static getHiddenWord(word, guessedLetters) {
    return word.split('')
               .map((letter) => guessedLetters.includes(letter) ? letter : '_')
               .join(' ');
  }
}

// export default GameLogic;
