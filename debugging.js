const cluster = require('cluster');
const http = require('http');
const os = require('os');
// const numCPUs = require('os').cpus().length;
let count = 0
if (cluster.isMaster) {

  console.log(`Master ${process.pid} is running`);

  const cpus = os.cpus().length;

  // Master creating workers
  //It is similary to the Child Process   child_process.spwan

          for (let i = 0; i < cpus; i++) {
            cluster.fork();
          }
          cluster.on('listening', (worker) => {
            console.log(`${worker.process.pid}  Listening`)
          });



} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    // res.writeHead(200);

    const message = `Worker Process pid : ${process.pid}`;
     process.online();


    
    //child or worker listening the master 
    process.on('message', (msg) => {
      if (msg === 'shutdown') {
        console.log("Shutdown working properly")  
        console.log("Received  ",msg);
        console.log("Message  ",message);  
      }
    });
   
    
    res.end(message);

  }).listen(3000);

  console.log(`Worker ${process.pid} started`);
}