const createAbortController = () => {
  const abortController = new AbortController();
  const { signal } = abortController;

  return { signal, abort: () => abortController.abort() };
};

export default createAbortController;
