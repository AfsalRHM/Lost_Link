import bcrypt from "bcrypt";

async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function comparePassword(
  password: string,
  ogPassword: string
): Promise<boolean> {
  try {
    const isPasswordMatch = await bcrypt.compare(password, ogPassword);
    return isPasswordMatch;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default {
  hashPassword,
  comparePassword,
};
