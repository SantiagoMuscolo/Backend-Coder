const bcrypt = require("bcrypt");

const createHash = async (password) => {
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    throw error;
  }
};

const isValidPassword = async (user, password) => {
  try {
    const match = await bcrypt.compare(password, user.password);
    return match;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createHash,
  isValidPassword,
};