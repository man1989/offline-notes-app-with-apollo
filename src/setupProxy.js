const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/v1/graphql',
    createProxyMiddleware({
      target: 'http://192.168.29.120:8080',
      ws: true,
      xfwd: true,
      changeOrigin: true
    })
  )  
};