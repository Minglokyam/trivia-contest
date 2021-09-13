export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  }
  
export const removeUnwantedCharacters = (text): string => {
    return text.replace(/[^A-Z0-9]/ig, "_");
}
