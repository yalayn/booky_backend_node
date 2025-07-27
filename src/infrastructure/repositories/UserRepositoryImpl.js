const mongoose = require('mongoose');
const UserModel = require('../database/models/UserModel');
const UserRepository = require('../../domain/repositories/UserRepository');
const User = require('../../domain/entities/User');

class UserRepositoryImpl extends UserRepository {
  constructor() {
    super();
    this.users = [];
  }

  async save(user) {
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser;
  }

  async findById(id) {
    const user = await UserModel.findOne({id});
    if (user) {
      return new User(user._id, user.name, user.username, user.password);
    }
    return null;
  }
  
  async findByUsername(username) {
    const user = await UserModel.findOne({username});    
    if (user) {
      user.comparePassword = UserModel.schema.methods.comparePassword.bind(user);
      return user;
    }
    return null;
  }

  async findBy_Id(id) {
    const user = await UserModel.findById(id);
    if (user) {
      return new User(user._id, user.name, user.username, user.password);
    }
    return null;
  }    

}

module.exports = UserRepositoryImpl;