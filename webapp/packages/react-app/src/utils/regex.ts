export const isRegexMatch = (regex:RegExp, input:string): boolean => {
  return regex.test(input);
}

export const getRegexMatches = (regex:RegExp, input:string): RegExpExecArray|null => {
  return regex.exec(input);
}