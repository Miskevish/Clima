export default {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{js,css,png,html}'
  ],
  swDest: 'dist/service-worker.js',
  ignoreURLParametersMatching: [
    /^utm_/,
    /^fbclid$/
  ]
};