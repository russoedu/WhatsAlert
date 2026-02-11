/* istanbul ignore next */
/**
 * Wait for an amount of seconds
 */
export async function _wait (seconds = 1) {
  function hold () {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  }
  await hold()
}
