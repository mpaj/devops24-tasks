const express = require('express');
const { json, static } = express;
const app = express();
const execSync = require('child_process').execSync;
const os = require('os');
const checkDiskSpace = require('check-disk-space').default;
const http = require('http');

const LISTENPORT = 8199;

app.use(json());
app.use(static('.'));

const getLocalSystemInfo = async () => {
    
    let allinfo = {};

    const networkInterfaces = os.networkInterfaces();
    allinfo.IP = networkInterfaces.eth0 ? networkInterfaces.eth0[0].address : '127.0.0.1'; 
    // 'eth0' for Docker, fallback to localhost

    allinfo.processes = execSync('ps aux --sort=-%cpu', { encoding: 'utf-8' }); 
    allinfo.processes = allinfo.processes.split('\n');

    allinfo.disk_space = await checkDiskSpace('/');  

    allinfo.uptime = os.uptime(); 
    allinfo.hostname = os.hostname();
    //console.log('Output was:\n', allinfo);
    return allinfo
}

function getRemoteSystem () {
    return new Promise((resolve, reject) => {
        http.get('http://backend-flask:5000/status', (res) => {
          let data = '';
    
          res.on('data', (chunk) => {
            data += chunk;
          });
    
          res.on('end', () => {
            try {
              const jsonData = JSON.parse(data);
              resolve(jsonData);
            } catch (err) {
              reject('Error parsing JSON');
            }
          });
        }).on('error', (err) => {
          reject('Error: ' + err.message);
        });
      });
}

let onTimeOut = false;

app.get('/', async (req, res) => {

  if (!onTimeOut) {
    res.setHeader('Content-Type', 'application/json');
    let service1status = await getLocalSystemInfo();
    console.log("Sleep flag is ", onTimeOut);
    console.log("Served by ", service1status.hostname);
    //console.log(info)
    try {
        var service2status = await getRemoteSystem();
        //console.log("remote says:", service2status);
    } catch (err) {
        console.error("failed getting remote status: ", err);
        return;
    }
    const response = {
        "Service":
            {
            "IP":`${service1status.IP}`, 
            "processes":`${service1status.processes}`, 
            "disk_space":`${JSON.stringify(service1status.disk_space)}`, 
            "uptime":`${service1status.uptime}`
            },
        "Service2":
            {
            "IP":`${service2status.IP}`, 
            "processes":`${service2status.processes}`, 
            "disk_space":`${JSON.stringify(service2status.disk_space)}`, 
            "uptime":`${service2status.uptime}`
            },
    };
    res.json(response);
    onTimeOut = true;
    execSync('sleep 2');
    onTimeOut = false;
    //setTimeout(( () => {
    //  console.log("Sleeping for 2000ms!")}), 2000);
    //  onTimeOut = false;
  }
  else {
    console.log("Server is sleeping!");
  }
})

app.listen(LISTENPORT, () => {
    console.log(`listening on ${LISTENPORT}`);
})