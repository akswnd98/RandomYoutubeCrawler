export async function waitFor (ms: number) {
  await new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
};
