import { c } from 'declarativas';

export default (children) => [
  c('save'),
  children,
  c('restore'),
];
