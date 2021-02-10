export default (initialState) => {
  let state = initialState;
  const set = (callback) => {
    state = {
      ...state,
      ...callback(state),
    };
  };
  const get = () => state;

  return { get, set };
};
