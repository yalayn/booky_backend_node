// src/domain/entities/User.js

class User {
    constructor(_id, name, username, password) {
      this._id       = _id;
      this.name     = name;
      this.username = username;
      this.password = password;
    }
  }
  
  module.exports = User;  