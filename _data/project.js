module.exports = function() {
    return {
      environment: process.env.ENVIRONMENT || "dev"
    };
  };