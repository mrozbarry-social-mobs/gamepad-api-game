const dig = (obj, attrs, defaultValue = undefined) => {
  if (attrs.length === 0 || !obj) return obj || defaultValue;
  return dig(obj[attrs[0]], attrs.slice(1), defaultValue);
};

export default dig;
