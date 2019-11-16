import { Block, buildFakeBlock, buildFakeBlocks } from '../../src/index'

describe('Blocks test', () => {
  test('buildFakeBlock', () => {
    const block: Block = buildFakeBlock()

    expect(block).toBeDefined()
  });

  test('that I can override buildFakeBlock', () => {
    const newDifficulty = 1000000;
    const block: Block = buildFakeBlock({
      difficulty: newDifficulty
    })

    expect(block).toBeDefined()
    expect(block.difficulty).toEqual(newDifficulty)
  });

  test('buildFakeBlocks', () => {
    const blocks: Block[] = buildFakeBlocks()

    expect(blocks).toBeDefined()
    expect(blocks).toHaveLength(2)
  });
});
