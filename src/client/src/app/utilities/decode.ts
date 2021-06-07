export const decodeHtmlEntities = (encodedString: string): string | null => {
  if (!encodedString) return null;
  // According to https://stackoverflow.com/questions/1147359/how-to-decode-html-entities-using-jquery#answer-1395954
  const textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  return textArea.value;
};
