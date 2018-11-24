module.exports = function(config) {
  const webpackConfig = require('./webpack.config.js');
  const testFilePattern = ['src/**/*.spec.js'];
  const extraFiles = ['node_modules/@babel/polyfill/dist/polyfill.js'];

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: (getTestFiles)(testFilePattern, extraFiles),
    preprocessors: testFilePattern.reduce(reducePreprocessors, {}),
    webpack: webpackConfig,
    reporters: ['progress'],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    concurrency: Infinity
  });
}

function reducePreprocessors(acc, next) {
  acc[next] = ['webpack'];
  return acc;
}

function getTestFiles(testFilePattern, extraFiles) {
  const testFiles = testFilePattern.map(function(item) { return { pattern: item, watched: true }; });
  testFiles.push(...extraFiles);
  return testFiles;
}
