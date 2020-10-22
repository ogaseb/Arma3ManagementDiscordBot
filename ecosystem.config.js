module.exports = {
  apps: [
    {
      name: "WorldTensionBot",
      script: "./index.js",
      instances: "1",
      watch: true,
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
