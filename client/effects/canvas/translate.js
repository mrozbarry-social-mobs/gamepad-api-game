import { c } from 'declarativas';
import preserveState from './preserveState.js';

export default ({ x, y }, children = false) => preserveState([
  c('translate', { x, y }),
  children,
]);
