const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PWD = process.env.MONGO_PWD;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PWD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?ssl=true&replicaSet=cinecampus-5595-rs0`;

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
