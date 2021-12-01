module.exports = {
  apps: [
    {
      name: "Arma3ManagementDiscordBot",
      script: "./build/index.js",
      log_date_format: "YYYY-MM-DD HH:mm Z",
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
