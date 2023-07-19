export const isRegexMatch = (regex:RegExp, input:string): boolean => {
  return regex.test(input);
}