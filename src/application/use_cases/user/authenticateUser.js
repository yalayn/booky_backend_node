// src/application/use_cases/authenticateUser.js

const jwt = require('jsonwebtoken');
const { UserNotFoundError, InvalidPasswordError } = require('../../errors');

const authenticateUser = async (userRepository, { username, password }) => {
  const user = await userRepository.findByUsername(username);
  if (!user) {
    throw new UserNotFoundError('User not found');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new InvalidPasswordError('Invalid password');
  }

  const payload = { _id: user._id, username: user.username, name: user.name };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME_REFRESH_TOKEN }); // Refresh token valid for 7 days

  return { token: token, refresh_token: refreshToken, user: payload };
};

module.exports = { authenticateUser };
