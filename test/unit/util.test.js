function isLF() {
  let str = `\u2029`,
      pattern = /\r?\n?/g;

  return pattern.test(str);
}

describe('utils', () => {
  test('line Feed', () => { expect(isLF()).toBe(true); });
});