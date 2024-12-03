const sorterFn = (a, b) => {
	return a.path > b.path ? 1 : -1;
};

class CustomSequencer {
	/**
	 * Select tests for shard requested via --shard=shardIndex/shardCount
	 * Sharding is applied before sorting
	 */
	shard(tests, options) {
		const { shardIndex, shardCount } = options;
		const shardSize = Math.ceil(tests.length / shardCount);
		const shardStart = shardSize * (shardIndex - 1);
		const shardEnd = shardSize * shardIndex;

		return [...tests].sort(sorterFn).slice(shardStart, shardEnd);
	}

	/**
	 * Sort test to determine order of execution
	 * Sorting is applied after sharding
	 */
	sort(tests) {
		// Test structure information
		// https://github.com/facebook/jest/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/jest-runner/src/types.ts#L17-L21
		const copyTests = Array.from(tests);
		return copyTests.sort(sorterFn);
	}

  cacheResults() {
    return null;
  }
}

export default CustomSequencer