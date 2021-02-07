import { c } from 'declarativas';
import preserveState from './preserveState.js';

export default (fontValue, children) => preserveState([
  c('font', { value: fontValue }),
  children,
]);

