const jwt = require('jsonwebtoken');

function generateAccessToken(userId, userPN) {
    // Generate JWT token using the userId and phone number
    const payload = {
        userId: userId,
        userPN: userPN
    }

    const secret = ";oaihnwnef;awonbfe123123123";
    const options = { expiresIn: '21d'};

    return jwt.sign(payload, secret, options)
}

function verifyAccessToken(token) {
    const secret = ";oaihnwnef;awonbfe123123123";

    try {
        const decoded = jwt.verify(token, secret);
        return { success: true, data: decoded };
      } catch (error) {
        return { success: false, error: error.message };
      }
}

module.exports = {
    generateAccessToken, verifyAccessToken
}