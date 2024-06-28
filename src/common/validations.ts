
export const textLength = {
  min: 3,
  short: 60,
  medium: 250,
  large: 2500,
};

export const regExp = {
  textDotHyphenLower: /^[a-z][a-z0-9.-]*$/, // basic name lowercase
  textDotHyphen: /^[a-zA-Z][a-zA-Z0-9.-]*$/, // basic name any case
  textDotHyphenSpace: /^[a-zA-Z][a-zA-Z0-9 .-]*$/, // complex name any case (several words)
  textHyphen: /^[a-zA-Z][a-zA-Z0-9-]*$/, // basic name any case whitout dot
  textSymbols: /^[a-zA-Z][a-zA-Z0-9 .,;:()'/_-]*$/, // english description
  intTextDotHyphenSpace: /^\p{L}[\p{L}\d .'-]*$/u, // multilingual complex name
  intTextSymbols: /^\p{L}[\p{L}\d .,;:()'/_-]*$/u, // multilingual description
  anyText: /^\p{L}[\s\S]+$/u, // anything (begin with letter)
};
