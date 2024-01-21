const bcrypt = require('bcrypt');

// Encrypts the password using the hash function
async function generateHash(password) {
    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds);

    return hash;
}


// Verifies the password when compared to the has stored in the database
async function verifyHash(password, hash) {
    const result = await bcrypt.compare(password, hash);

    return result
}

module.exports = {
    generateHash, verifyHash
}