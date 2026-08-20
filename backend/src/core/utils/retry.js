const retry = async (fn, times = 3) => {
  let lastError;

  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
};

module.exports = retry;