const express = require('express');
const { json, urlencoded, static } = express;
const app = express();
const execSync = require('child_process').execSync;
const os = require('os');
const checkDiskSpace = require('check-disk-space').default;

const LISTENPORT = 8199;

app.use(json());
app.use(static('.'));

const getSystemInfo = async () => {
    
    let allinfo = {};

    const networkInterfaces = os.networkInterfaces();
    allinfo.IP = networkInterfaces.eth0 ? networkInterfaces.eth0[0].address : '127.0.0.1'; 
    // 'eth0' for Docker, fallback to localhost

    allinfo.processes = execSync('ps aux --sort=-%cpu', { encoding: 'utf-8' }); 
    allinfo.processes = allinfo.processes.split('\n');

    allinfo.diskspace = await checkDiskSpace('/');  

    allinfo.uptime = os.uptime(); 
    //console.log('Output was:\n', allinfo);
    return allinfo
}

app.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let info = await getSystemInfo();
    console.log(info)
    const response = {
        "Service" : {
        "IP":`${info.IP}`, 
        "processes":`${info.processes}`, 
        "disk_space":`${JSON.stringify(info.diskspace)}`, 
        "uptime":`${info.uptime}`
        },
    "Service2": {}
    };
    res.json(response);
    
})

app.listen(LISTENPORT, () => {
    console.log(`listening on ${LISTENPORT}`);
})