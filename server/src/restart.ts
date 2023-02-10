import { exec } from 'child_process'
const cmd = 'yarn start';

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`An error occurred while executing the command: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});