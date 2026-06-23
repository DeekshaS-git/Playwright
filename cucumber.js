module.exports = {
  default: {
    require: [
      'src/support/world.js',
      'src/support/hooks.js',
      'src/steps/*.js'
    ],
    format: [
      'progress',
      'json:reports/cucumber-report.json'
    ],
    publishQuiet: true
  }
};