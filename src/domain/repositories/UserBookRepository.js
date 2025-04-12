// src/domain/repositories/UserRepository.js

class UserBookRepository {
    
    async findByUserId(userId) {
      throw new Error('Not implemented');
    }

    async findByUserIdState(userId, state) {
      throw new Error('Not implemented');
    }

    async findUserBooksWithDetails(userId) {
      throw new Error('Not implemented'); 
    }

    async add(userId, bookId) {
      throw new Error('Not implemented...');
    }

    async remove(userId, bookId) {
      throw new Error('Not implemented');
    }

    async updateState(userId, bookId, newState) {
      throw new Error('Not implemented'); 
    }
    
  }
  
  module.exports = UserBookRepository;