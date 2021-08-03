module.exports = {
  apps: [
    // {
    //   name: "app",
    //   script: "npm start --prefix app",
    // },
    {
      name: "server",
      script: "npm start --prefix server",
    },
    {
      name: "backend",
      script: "npm run start:dev --prefix backend",
    },
  ],
};
