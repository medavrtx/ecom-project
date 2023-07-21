function capitalizeEveryWord(string) {
  const words = string.split(' ');

  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  const capitalizedString = capitalizedWords.join(' ');

  return capitalizedString;
}

module.exports = {
  capitalizeEveryWord
};
