
// function sendToPython() {
//     var python = require("child_process").spawn("python", [
//         "./python/calc.py",
//         "3",
//     ]);
//     python.stdout.on("data", function (data) {
//         console.log("Python response: ", data.toString("utf8"));
//         //result.textContent = data.toString("utf8");
//     });

//     python.stderr.on("data", (data) => {
//         console.error(`stderr: ${data}`);
//     });

//     python.on("close", (code) => {
//         console.log(`child process exited with code ${code}`);
//     });
// }

// export default sendToPython


//import { PythonShell } from 'python-shell'
const { PythonShell } = require('python-shell')
function pyShell(shellStr, data) {
    let options = {
        mode: 'json',
        pythonOptions: ['-u'],
        args: [data]         // 要发的数据
    }

    return new Promise((resolve, reject) => {
        PythonShell.run(shellStr, options, function (err, results) {
            if (err) {
                console.log(results)
                console.log(err)
                reject(err)
            }
            resolve(results)
        })
    })
}

// module.exports = {
//     pyShell
// }