// function linear(values) {
//   // Assuming values are ['foo', 'bar', 'baz']

//   // `from1` should be [undefined, 'foo', 'bar']
//   // `from2` should be ['bar', 'baz', undefined]
//   let from1 = values.slice(0, values.length - 1)
//   from1.unshift(undefined)
//   let from2 = values.slice(1, values.length)
//   from2.push(undefined)

//   // `from` should be
//   // [
//   //   'airflow2',
//   //   ['airflow1', 'airflow3']
//   //   ['airflow2', 'airflow4']
//   //   ['airflow3', 'airflow5']
//   //   'airflow4'
//   // ]
//   let from = values.map((value, index) => {
//     if (from1[index] === undefined) {
//       return from2[index];
//     }

//     if (from2[index] === undefined) {
//       return from1[index];
//     }

//     return [from1[index], from2[index]];
//   });

//   // return value should be
//   // [
//   //   { name: 'setfoo', from: 'bar', to: 'foo'},
//   //   { name: 'setbar', from: ['foo', 'baz'], to: 'bar'},
//   //   { name: 'setbaz', from: 'bar', to: 'baz'},
//   // ]
//   return values.map((value, index) => {
//     return {
//       name: `set${value}`,
//       from: from[index],
//       to: value
//     }
//   });
// }

// function loop(values) {
//   // Assuming values are ['foo', 'bar', 'baz']

//   // `from` should be
//   // [
//   //   'airflow2',
//   //   ['airflow1', 'airflow3']
//   //   ['airflow2', 'airflow4']
//   //   ['airflow3', 'airflow5']
//   //   'airflow4'
//   // ]
//   let from = values.slice(0, values.length - 1);
//   from.unshift(values[values.length - 1]);

//   // return value should be
//   // [
//   //   { name: 'setfoo', from: 'baz', to: 'foo'},
//   //   { name: 'setbar', from: 'foo', to: 'bar'},
//   //   { name: 'setbaz', from: 'bar', to: 'baz'},
//   // ]
//   return values.map((value, index) => {
//     return {
//       name: `set${value}`,
//       from: from[index],
//       to: value
//     }
//   });
// }



// // AIRFLOW : Linear
// // airflow1 ↔ airflow2 ↔ airflow3 ↔ airflow4 ↔ airflow5
// //console.log(linear(['airflow1', 'airflow2', 'airflow3', 'airflow4', 'airflow5']));

// // TIMER : Loop
// // timeroff → timer1 → timer2 → timer3
// //     ←        ←        ←        ↲
// //console.log(loop(['timeroff', 'timer1', 'timer2', 'timer3']));


// console.log([]
//   .concat(loop(['poweredoff', 'poweredon']))
//   .concat(loop(['rotateoff', 'rotateon']))
//   .concat(linear(['airflow1', 'airflow2', 'airflow3', 'airflow4', 'airflow5']))
//   .concat(loop(['timeroff', 'timer1', 'timer2', 'timer3']))
// )

// let fan = [
//   {
//     type: 'loop',
//     states: ['poweredoff', 'poweredon']
//   },
//   {
//     type: 'loop',
//     states: ['rotateoff', 'rotateon']
//   },
//   {
//     type: 'linear',
//     states: ['airflow1', 'airflow2', 'airflow3', 'airflow4', 'airflow5']
//   },
//   {
//     type: 'loop',
//     states: ['timeroff', 'timer1', 'timer2', 'timer3']
//   }
// ];


// // expected:
// // [
// //   { name: 'turnon', from: 'poweredoff', to: 'poweredon' },
// //   { name: 'turnoff', from: 'poweredon', to: 'poweredoff'},
// //   { name: 'rotateoff', from: 'rotatingon', to: 'rotatingoff' },
// //   { name: 'rotateon', from: 'rotatingoff', to: 'rotatingon' },
// //   { name: 'setairflow1', from: 'airflow2', to: 'airflow1'},
// //   { name: 'setairflow2', from: ['airflow1', 'airflow3'], to: 'airflow2'},
// //   { name: 'setairflow3', from: ['airflow2', 'airflow4'], to: 'airflow3'},
// //   { name: 'setairflow4', from: ['airflow3', 'airflow5'], to: 'airflow4'},
// //   { name: 'setairflow5', from: 'airflow4', to: 'airflow5'},
// //   { name: 'settimeroff', from: 'timer3', to: 'timeroff'},
// //   { name: 'settimer1', from: 'timeroff', to: 'timer1'},
// //   { name: 'settimer2', from: 'timer1', to: 'timer2'},
// //   { name: 'settimer3', from: 'timer2', to: 'timer3'}
// // ]

