export default (fn, milliseconds = 1) => {
  let handle = null;

  return (...params) => {
    clearTimeout(handle);
    handle = setTimeout(() => fn(...params), milliseconds);
  };
};
