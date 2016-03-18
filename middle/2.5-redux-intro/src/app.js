var createStore = require('redux').createStore;

function counter(state, action) {
}

var store = createStore(counter);

console.log('Current store', store.getState());
