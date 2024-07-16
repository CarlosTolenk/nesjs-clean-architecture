import path from 'path';
import nconf from 'nconf';
import fs from 'fs';

const secretsPath = '/etc/secrets/';

nconf
  .env({ separator: '.', lowerCase: true, parseValues: true })
  .use('memory')
  .file(path.join(__dirname, '../assets/default.json'));

const logLevel = nconf.get('log:level') ?? 'error';
const isDevelopment = !process.env.STAGE_NAME;

nconf.set('isDevelopment', isDevelopment ?? true);
nconf.set('profile', nconf.get('cluster_profile') ?? 'dev');
nconf.set('logLevel', logLevel);

if (fs.existsSync(secretsPath)) {
  for (const fileName of fs.readdirSync(secretsPath)) {
    const fullPath = `${secretsPath}${fileName}`;
    const content = fs.readFileSync(fullPath, {
      encoding: 'utf8',
      flag: 'r',
    });
    const contentCleaned = content.replace(/\r?\n|\r/g, '');
    nconf.set(fileName.replace(/\./g, ':'), contentCleaned);
  }
}
