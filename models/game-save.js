var Schema = require('mongoose').Schema;
module.exports = {
  name: 'GameSave',
  schema: {
    name: {
      type: String,
      validate: [function(name){
        return name.trim().toLowerCase() !== '';
      }, 'Name can\'t be empty.']
    },
    data: Buffer
  }
};