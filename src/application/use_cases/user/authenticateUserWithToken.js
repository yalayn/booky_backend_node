
const jwt = require('jsonwebtoken');
const { UserNotFoundError } = require('../../errors');

const authenticateUserWithToken = async (userRepository, { refreshToken }) => {
    // Verificar el token de actualización
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    // Buscar al usuario por ID
    const user = await userRepository.findById(decoded.id);
    if (!user) {
        throw new UserNotFoundError('User not found');
    }

    // Generar un nuevo token
    const payload = { id: user.id, username: user.username };
    const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });

    console.log(`New token generated for user ${user.username}: ${newToken}`);

    return newToken;
};

module.exports = { authenticateUserWithToken };