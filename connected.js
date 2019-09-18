const cluster = require('cluster');
const http = require('http');
if (cluster.isMaster) {
    const worker = cluster.fork();
    worker.on('listening', (address) => {
      console.log("shutdown hone wala ")
      worker.send('shutdown');
      console.log("disconnect hone wala ")
      worker.disconnect();
      console.log("timeout ke baad kill  hone wala ")
      timeout = setTimeout(() => {
        worker.kill();
      }, 2000);
    });




  } else if (cluster.isWorker) {
    const net = require('net');
    const server = net.createServer((socket) => {
      // Connections never end
    });
  
    server.listen(8000);
  
    process.on('message', (msg) => {
      if (msg === 'shutdown') {
        // Initiate graceful close of any connections to server
        console.log(`hello process : ${process.pid}`)
      }
    });
    process.on('disconnect', (msg) => {
      console.log(`hello process   disconnect hone wala : ${process.pid}`)
      });
  }