import {PASSWORD_MINLENGTH, PASSWORD_SPECIAL_CHARS_POOL} from '@constants/validation';

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCharacter(characters: string): string {
  const charactersLength = characters.length;
  return characters.charAt(Math.floor(Math.random() * charactersLength));
}

export function generatePassword(minLength = PASSWORD_MINLENGTH, maxLength = PASSWORD_MINLENGTH): string {
  const numbersPool = '0123456789';
  const lettersPool = 'abcdefghijklmnopqrstuvwxyz';
  const specialCharsPool = PASSWORD_SPECIAL_CHARS_POOL;
  const lowerToUpperCaseCoefficient = 0.75;
  const passwordLength = getRandomInt(minLength, maxLength);
  let pool: string | string[] = [numbersPool, lettersPool, specialCharsPool];
  let password = '';
  // Password should have at least one number, letter and special character
  for (let i = pool.length; i; i--) {
    const characters = pool[i - 1];
    password += getRandomCharacter(characters);
  }

  const remainingLength = passwordLength - pool.length;
  pool = pool.join('');

  for (let i = remainingLength; i; i--) {
    let randomCharacter = getRandomCharacter(pool);
    const isLetter = /[a-z]/.test(randomCharacter);

    if (isLetter) {
      const isUppercase = Math.random() > lowerToUpperCaseCoefficient;
      if (isUppercase) {
        randomCharacter = randomCharacter.toUpperCase();
      }
    }

    password += randomCharacter;
  }

  return password;
}
