import index from '../src/index';

describe('Package test', () => {
  it('should start the package', () => {
    const expectedResult = 'running';

    const result = index.start();

    expect(result).toEqual(expectedResult);
  });
});
