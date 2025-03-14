const { createWristbandAuth } = require('@wristband/express-auth');

const wristband = createWristbandAuth({
  clientId: process.env.WRISTBAND_CLIENT_ID,
  clientSecret: process.env.WRISTBAND_CLIENT_SECRET,
  // NOTE: If deploying your own app to production, do not disable secure cookies!!
  dangerouslyDisableSecureCookies: process.env.DANGEROUSLY_DISABLE_SECURE_COOKIES === "true",
  loginStateSecret: process.env.WRISTBAND_LOGIN_STATE_SECRET,
  loginUrl: process.env.SERVER_LOGIN_URL,
  redirectUri: process.env.SERVER_CALLBACK_URL,
  wristbandApplicationDomain: process.env.WRISTBAND_APPLICATION_DOMAIN,
});

module.exports = wristband;
