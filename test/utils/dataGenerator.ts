
// helper function to generate random names of size length.
export function generateRandomName(size: number, lowerCaseFlag?: boolean): string {
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';

  let randomName : string = upperCase.charAt(Math.floor(Math.random() * upperCase.length));
  for (let i = 1; i < size; i++) {
    randomName += lowerCase.charAt(Math.floor(Math.random() * lowerCase.length));
  }

  return (lowerCaseFlag) ? randomName.toLowerCase() : randomName;
}
