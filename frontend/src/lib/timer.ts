/**
 * Pauses the execution of the program for a specified number of seconds.
 *
 * @param {number} seconds - The number of seconds to pause execution.
 * @returns {Promise} A Promise that resolves after the specified number of seconds.
 */
export function wait(seconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000);
    });
}