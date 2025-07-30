const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { UserNotFoundError } = require('../../errors');

const authenticateUserWithToken = async (userRepository, { refreshToken }) => {
    // Verificar el token de actualización
    const userToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const id   = userToken._id;
    const user = await userRepository.findBy_Id(id);
    if (!user) {
        throw new UserNotFoundError('User not found in authenticateUserWithToken');
    }

    // Generar un nuevo token
    const payload = { _id: user._id, username: user.username, name: user.name };
    const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });

    return newToken;
};

module.exports = { authenticateUserWithToken };