const os = require('os');

const config = {
  gcloud: {
    bucket: 'fldemo-files',
    hash: 'ad0d8e58dda97bdf4c96aacb75ee85b5',
  },
  bcrypt: {
    saltRounds: 12,
  },
  admin_pass: 'password',
  admin_email: 'admin@flatlogic.com',
  providers: {
    LOCAL: 'local',
    GOOGLE: 'google',
    MICROSOFT: 'microsoft',
  },
  secret_key: 'HUEyqESqgQ1yTwzVlO6wprC9Kf1J1xuA',
  remote: '',
  port: process.env.NODE_ENV === 'production' ? '' : '8080',
  hostUI: process.env.NODE_ENV === 'production' ? '' : 'http://localhost',
  portUI: process.env.NODE_ENV === 'production' ? '' : '3000',

  portUIProd: process.env.NODE_ENV === 'production' ? '' : ':3000',

  swaggerUI: process.env.NODE_ENV === 'production' ? '' : 'http://localhost',
  swaggerPort: process.env.NODE_ENV === 'production' ? '' : ':8080',
  google: {
    clientId:
      '671001533244-kf1k1gmp6mnl0r030qmvdu6v36ghmim6.apps.googleusercontent.com',
    clientSecret: 'Yo4qbKZniqvojzUQ60iKlxqR',
  },
  microsoft: {
    clientId: '4696f457-31af-40de-897c-e00d7d4cff73',
    clientSecret: 'm8jzZ.5UpHF3=-dXzyxiZ4e[F8OF54@p',
  },
  uploadDir: os.tmpdir(),
  email: {
    from: 'Ai assistant for domain <app@flatlogic.app>',
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    auth: {
      user: 'AKIAVEW7G4PQUBGM52OF',
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  roles: {
    super_admin: 'Super Administrator',

    admin: 'Administrator',
    user: 'User',
  },

  project_uuid: '86454669-161f-465e-832d-6c1a83ba859f',
  flHost:
    process.env.NODE_ENV === 'production'
      ? 'https://flatlogic.com/projects'
      : 'http://localhost:3000/projects',
};

config.host =
  process.env.NODE_ENV === 'production' ? config.remote : 'http://localhost';
config.apiUrl = `${config.host}${config.port ? `:${config.port}` : ``}/api`;
config.swaggerUrl = `${config.swaggerUI}${config.swaggerPort}`;
config.uiUrl = `${config.hostUI}${config.portUI ? `:${config.portUI}` : ``}/#`;
config.backUrl = `${config.hostUI}${config.portUI ? `:${config.portUI}` : ``}`;

module.exports = config;
