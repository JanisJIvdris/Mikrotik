require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

console.log("DB_HOST:", process.env.DB_HOST);
console.log("NODE_ENV:", process.env.NODE_ENV);

function getEnv(key, fallback) {
  if (!process.env[key] && fallback === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return process.env[key] || fallback;
}

module.exports = {
  PORT: getEnv("PORT", 3000),
  DB_HOST: getEnv("DB_HOST", "localhost"),
  DB_USER:
    process.env.NODE_ENV === "production"
      ? getEnv("DB_USER")
      : getEnv("DB_USER", "postgres"),
  DB_PASS:
    process.env.NODE_ENV === "production"
      ? getEnv("DB_PASS")
      : getEnv("DB_PASS", "password"),
  DB_NAME:
    process.env.NODE_ENV === "test"
      ? getEnv("TEST_DB_NAME", "project_management_test")
      : process.env.NODE_ENV === "production"
      ? getEnv("DB_NAME")
      : getEnv("DB_NAME", "project_management"),
  DB_PORT: getEnv("DB_PORT", 5432),
  JWT_SECRET:
    process.env.NODE_ENV === "production"
      ? getEnv("JWT_SECRET")
      : getEnv("JWT_SECRET", "your_jwt_secret"),
};
