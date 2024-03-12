export default () => ({
  secretJwt: process.env.JWT_SECRET_KEY,
  expiresIn: process.env.EXPIRES_IN
});
