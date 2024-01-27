/* eslint-disable no-console */
import { consoleFmt as cfmt } from '../src/consoleFmt';

console.log(cfmt.color('red', 'red'));

console.log(cfmt.bold('white bold'));

console.log(cfmt.underline('white underline'));

console.log(cfmt.bgColor('red', 'bg red'));

// bolde red
console.log(cfmt.bold(cfmt.color('red', 'red')));

// underline red
console.log(cfmt.underline(cfmt.color('red', 'red')));

// bold underline red
console.log(cfmt.bold(cfmt.underline(cfmt.color('red', 'red'))));

// bold bg red
console.log(
  cfmt.bold(cfmt.bgColor('red', cfmt.color('white', 'white bg red'))),
);
