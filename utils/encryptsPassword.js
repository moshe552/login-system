const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.encryptsPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
}