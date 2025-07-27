// src/application/use_cases/registerUser.js

const registerUser = async (userRepository, { name, username, password}) => {
  // Lógica del caso de uso
  if (!name || !username || !password) {
    throw new Error('All fields are required');
  }

  const isUser = await userRepository.findByUsername(username);
  if (isUser) {
    throw new Error('Username already exists');
  }
  
  const user   = { name, username, password };
  const result = await userRepository.save(user);
  if (!result) {
    throw new Error('Error registering user');
  }
  return result;
};

module.exports = { registerUser };