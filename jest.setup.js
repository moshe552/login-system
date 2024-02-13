const app = require('./app');
const http = require('http');

let server;
beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done); 
});

afterAll((done) => {
  server.close(done);   
});

// Set a custom port for testing
process.env.PORT = 3001
// Set a custom environment for testing
process.env.NODE_ENV = 'test'

