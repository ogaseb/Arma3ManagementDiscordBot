module.exports = {
  apps: [
    {
      name: "Arma3ManagementDiscordBot",
      script: "./index.js",
      instances: "1",
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
