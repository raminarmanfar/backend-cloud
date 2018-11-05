export default {
  defaultProfileImage: {
    imageName: 'defaultUser.png',
    path: 'uploads/'
  },
  http: {
    host: process.env.host || 'localhost',
    port: process.env.PORT || 5000
  },
  services: {
    users: '/api/users',
    posts: '/api/posts',
    contacts: '/api/contacts'
  },
  files: {
    usersProfileImagesPath: 'uploads/profileImages/',
  },
  client: {
    host: process.env.host || 'localhost',
    port: process.env.PORT || 4200
  },
  fileStorage: {
    usersProfileImageUrl: 'uploads/profileImages/'
  },
  mongoDB: {
    url: process.env.MONGODB_URL || "localhost",
    port: process.env.MONGODB_PORT || "27017",
    dbName: process.env.MONGODB_NAME || "my-cloud-database",
    user: process.env.MONGODB_USER && process.env.MONGODB_USER.trim(),
    password: process.env.MONGODB_PW && process.env.MONGODB_PW.trim()
  },
};
