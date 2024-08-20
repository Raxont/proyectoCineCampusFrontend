const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PWD = process.env.MONGO_PWD;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_CLUSTER = process.env.MONGO_CLUSTER;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;

console.log("MONGO_USER:", MONGO_USER);
console.log("MONGO_PWD:", MONGO_PWD);
console.log("MONGO_HOST:", MONGO_HOST);
console.log("MONGO_CLUSTER:", MONGO_CLUSTER);
console.log("MONGO_PORT:", MONGO_PORT);
console.log("MONGO_DB:", MONGO_DB);

const MONGO_URI = `${MONGO_HOST}${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}:${MONGO_PORT}/${MONGO_DB}`;

const dataDir = __dirname;

fs.readdirSync(dataDir).forEach(file => {
  if (path.extname(file) === '.json') {
    const collection = path.basename(file, '.json');
    const command = `mongoimport --uri="${MONGO_URI}" --collection ${collection} --file "${path.join(dataDir, file)}" --jsonArray`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  }
});
