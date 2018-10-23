export default {
  http: {
    port: process.env.PORT || 5000
  },
  mongoDB: {
    url: process.env.MONGODB_URL || "localhost",
    port: process.env.MONGODB_PORT || "27017",
    dbName: process.env.MONGODB_NAME || "my-cloud-database",
    user: process.env.MONGODB_USER && process.env.MONGODB_USER.trim(),
    password: process.env.MONGODB_PW && process.env.MONGODB_PW.trim()
  },
};
