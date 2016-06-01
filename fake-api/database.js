// dreadful in memory DB

var initialData = require('./starting-data');

var liveDb = Object.assign({}, initialData);

var makeDbMethods = function(key) {
  return {
    getAll: function() {
      return liveDb[key];
    },
    get: function(id) {
      return liveDb[key].find(function(a) {
        return a.id === id;
      });
    },
    add: function(item) {
      var newId = liveDb[key][liveDb[key].length - 1].id + 1;
      item.id = newId;
      var newItem = Object.assign(item, { id: newId });
      liveDb[key].push(newItem);
      return liveDb[key][liveDb[key].length - 1];
    }
  };
};
var db = {
  users: makeDbMethods('users'),
  issues: makeDbMethods('issues')
}


module.exports = db;
