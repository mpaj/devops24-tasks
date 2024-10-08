
from flask import Flask, jsonify
import socket
import subprocess

app = Flask(__name__)

ip = socket.gethostbyname(socket.gethostname())
processes = subprocess.run(["ps", "aux"], capture_output=True, text=True).stdout.split("\n")
def get_uptime():
    with open('/proc/uptime', 'r') as f:
        uptime_seconds = float(f.readline().split()[0])

    return uptime_seconds
diskspace = subprocess.run(["df", "/", "-H"], capture_output=True, text=True).stdout.split("\n")

statusmessage = {
    'IP' : ip,
    'processes': processes, 
    'disk_space': diskspace, 
    'uptime' : get_uptime()
}
print(statusmessage)

@app.route('/status', methods=['GET'])
def index():
    return jsonify(statusmessage)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
    #app.run(debug=True)