export const delayTimer = (delayMs: number):Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(resolve, delayMs);
    } catch (err) {
      reject(err);
    }
  });
}