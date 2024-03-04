export default () => ({
  secretJwt: process.env.JWT_KEY,
  expiresIn: process.env.EXPIRES_IN
});
