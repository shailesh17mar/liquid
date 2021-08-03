module.exports = {
  apps: [
    {
      name: "realtime",
      script: "npm start --prefix realtime",
    },
    {
      name: "api",
      script: "npm run start:dev --prefix api",
    },
    {
      name: "app",
      script: "npm start --prefix workspace",
    },
  ],
};
