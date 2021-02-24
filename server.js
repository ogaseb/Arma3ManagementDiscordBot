const fs = require("fs");
const progress = require("progress-string");
const array = ["450814997", "2281685552", "2291129343"];
let interval = 0;
const { exec } = require("child_process");
const { restartServer } = require("./helpers/helpers");

// var spawn = require('child_process').spawn;
// const childProcess = spawn("", {
//     stdio: 'ignore', // piping all stdio to /dev/null
//     detached: true
// }).unref();

const run = async () => {
  // const out = fs.openSync('./out.log', 'a');
  // const err = fs.openSync('./out.log', 'a');
  // const child = spawn("./a3runscript.sh", [] ,{detached: true, stdio: [ 'ignore', out, err ]});
  restartServer();
};

return run();

// child.stdin.write("cd ..\n");
// child.stdin.write(`${id}\n`);

// child.stdout.on("data", data => {
//     console.log(`${data}\n`);
//
//   });

// console.log(childProcess)

// fs.writeFileSync("pidFile", childProcess.pid+'\n', 'utf8');

// exec(`tmux kill-session -t arma3`, (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
// });

// exec(`tmux new-session -d -s arma3 \'/home/propanek/Steam/arma3/arma3server -name=server -config=server.cfg\'`, (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
// });
// let bar = progress({
//   width: 50,
//   total: parseInt(array.length),
//   style: function(complete, incomplete) {
//     return "[" + complete + ">" + incomplete + "]";d
//   }
// });

// const download = async (id)  => {
//   const checkIfEnd = () => {
//     if (interval + 1 > array.length) {
//       console.log(`${bar(interval)} ${interval}/${array.length}`);
//       return console.log("end");
//     } else {
//       return download(array[interval]);
//     }
//   };

//   const child = spawn("./a3upddownmod.sh");

//   try {
//     await fs.promises.access(`/home/propanek/Steam/steamapps/workshop/content/107410/${id}`);
//     console.log(
//       `${bar(interval)} ${interval}/${array.length} mod found, updating - `
//     );

//     child.stdin.write("u\n");
//     child.stdin.write("s\n");
//     child.stdin.write("\n");
//     child.stdin.write(`${id}\n`);
//     // child.stdout.on('data', (data) => {
//     //   console.log(`${data}\n`);
//     // });

//     child.on("close", () => {
//       interval++;
//       return checkIfEnd();
//     });
//   } catch (e){
//     console.log(`${bar(interval)} ${interval}/${array.length} downloading - `);
//     child.stdin.write("d\n");
//     child.stdin.write(`${id}\n`);

//     child.stdout.on("data", data => {
//       // console.log(`${data}\n`);
//       const searchInData = data.toString().search("Fixed upper case for MOD");
//       if (searchInData !== -1) {
//         // console.log(`its kinda working?`);
//       }
//     });

//     child.on("close", code => {
//       console.log(interval);
//       interval++;
//       fs.symlink(
//         `/home/propanek/Steam/steamapps/workshop/content/107410/${id}`,
//         `/home/propanek/Steam/arma3/${id}`,
//         err => {
//           console.log(err);
//         }
//       );
//       return checkIfEnd();
//     });
//   }
// };

// return download(array[interval]);
