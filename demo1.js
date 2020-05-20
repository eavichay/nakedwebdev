import { Dispatcher } from './messaging.js';

const messageBus = Dispatcher('my-message-bus');


// User interactions becomes application messages

document.querySelector('#demo-input').onchange = (event) => {
  messageBus.emit('search', event.target.value);
};

document.querySelector('#clear').onclick = () => messageBus.emit('clear');





// Reactions to application messages

messageBus.on('clear', () => {
  document.querySelector('#search-results').innerHTML = '';
});

messageBus.on('search', (data) => {
  document.querySelector(
    '#search-results'
  ).innerHTML += /*html*/ `<div>User searched for ${data}</div>`;
});





// Let's add a counter, for multiple consumes of the same message

// let searchCount = 0;

// messageBus.on('search', () => {
//   searchCount++;
//   document.title = `Search: ${searchCount}`;
// });
