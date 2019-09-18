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
          // Master listening child online vent
          cluster.on('online', (worker,) => {
            console.log(`Worker  online  : ${worker.process.pid}`);
          });
          // Master listening child exit event
          cluster.on('exit', (worker, code) => {

                          console.log(`${worker.process.pid} is killed`);
                          console.log("remaining wokers");
                          
                          let workers = Object.keys(cluster.workers);
                          for (let worker of workers) {
                            console.log(cluster.workers[worker].process.pid);
                          }
                          cluster.fork();
                          console.log("After deletion new worker is created");
                          
                          workers = Object.keys(cluster.workers);
                          for (let worker of workers) {
                            console.log(cluster.workers[worker].process.pid);
                          }

          });
          // Master listening child disconnection event
          cluster.on('disconnect', (worker) => {
            console.log(`The worker #${worker.id} has disconnected`);
          });

} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    // res.writeHead(200);

    const message = `Worker Process pid : ${process.pid}`;
    process.online();

    process.disconnect();

    process.on('message', (msg) => {
      if (msg === 'shutdown') {
        // Initiate graceful close of any connections to server
        console.log("connected via" , process.pid);
                    setTimeout(()=>{
                          process.exit();
                    },9000)
      }
    });

    res.end(message);


  //   if (cluster.isWorker && count == 0) {
  //     count++;
  //     console.log('count :  ', count);
  //     console.log(message);
  //     process.exit(0);
  //     // res.end(`Current process\n ${process.pid}   Work done \n died`);

  //   }
   
}).listen(3000);

  console.log(`Worker ${process.pid} started`);
}