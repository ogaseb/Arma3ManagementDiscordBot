const { spawn } = require("child_process");
const fs = require("fs");
const progress = require("progress-string");

const array = ["450814997", "2281685552", "2291129343"];
let interval = 0;

let bar = progress({
  width: 50,
  total: parseInt(array.length),
  style: function(complete, incomplete) {
    return "[" + complete + ">" + incomplete + "]";
  }
});

const checkIfEnd = () => {
  if (interval + 1 > array.length) {
    console.log(`${bar(interval)} ${interval}/${array.length}`);
    return console.log("end");
  } else {
    return download(array[interval]);
  }
};

const download = id => {
  const child = spawn("./a3upddownmod.sh");

  if (
    fs.existsSync(
      `/home/propanek/Steam/steamapps/workshop/content/107410/${id}`
    )
  ) {
    console.log(
      `${bar(interval)} ${interval}/${array.length} mod found, updating - `
    );

    child.stdin.write("u\n");
    child.stdin.write("s\n");
    child.stdin.write("\n");
    child.stdin.write(`${id}\n`);
    // child.stdout.on('data', (data) => {
    //   console.log(`${data}\n`);
    // });

    child.on("close", () => {
      interval++;
      return checkIfEnd();
    });
  } else {
    // process.stdin.pipe(child.stdin)
    console.log(`${bar(interval)} ${interval}/${array.length} downloading - `);
    child.stdin.write("d\n");
    child.stdin.write(`${id}\n`);

    child.stdout.on("data", data => {
      // console.log(`${data}\n`);
      const searchInData = data.toString().search("Fixed upper case for MOD");
      if (searchInData !== -1) {
        // console.log(`its kinda working?`);
      }
    });

    child.on("close", code => {
      console.log(interval);
      interval++;
      fs.symlink(
        `/home/propanek/Steam/steamapps/workshop/content/107410/${id}`,
        `/home/propanek/Steam/arma3/${id}`,
        err => {
          console.log(err);
        }
      );
      return checkIfEnd();
    });
  }
};

download(array[interval]);
