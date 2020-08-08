export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: parseInt(process.env.PORT || '5050', 10),
  bcryptSalt: parseInt(process.env.BCRYPT_SALT || '10', 10),
  jwtSecret: process.env.JWT_SECRET || 'cop12$%#'
}
