const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10; // Adjust for desired security/performance balance
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function comparePassword(password, hashedPassword) {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
}

module.exports = {hashPassword, comparePassword};