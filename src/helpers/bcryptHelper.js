import bcrypt from "bcryptjs";

const saltRounds = 10;

export const PasswordHash = (pass) => {
  return bcrypt.hashSync(pass, saltRounds);
};
