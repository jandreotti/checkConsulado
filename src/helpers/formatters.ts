/**
 * Funcion que redondea un numero a la cantidad de decimales que se le indique.  Ej 1.2345, 2 => 1.23
 * @param num 
 * @param length 
 * @returns 
 */
export const roundNumber = (num: number, length: number) => {
  var number = Math.round(num * Math.pow(10, length)) / Math.pow(10, length);
  return number;
};


/**
 * Funcion que convierte un numero a string con la cantidad de decimales que se le indique. Ej 1.2345, 2 => 1.23.    Ej 1.2, 2 => 1.20
 * @param num 
 * @param decimals 
 * @returns 
 */
export const numberToDecimalString = (num: number, decimals: number) => {
  const number = (Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals);
  return number;
};