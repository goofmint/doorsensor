const config = require('./config');
const ECHOPF = require('./ECHO.min');
const Mcp3008 = require('mcp3008.js');
const adc = new Mcp3008();
const channel = 0;


ECHOPF.initialize(
  config.domain,
  config.applicationId,
  config.applicationKey
);


const login = async () => {
  const result = await ECHOPF.Members.login(
    config.memberInstanceId,
    config.login_id,
    config.password
  );
  return result;
};

const add = async (value) => {
  const entry = new ECHOPF.Databases.RecordObject(config.databaseInstanceId);
  entry.put('refid', Math.random().toString(36).slice(-8));
  entry.put('title', 'Test');
  entry.put('contents', {
    'switch': value
  });
  try {
    const result = await entry.push();
    return result;
  } catch (e) {
    console.log(e);
  }
};

const main = async () => {
  const user = await login();
  let old = null;
  setInterval(() => {
    adc.read(channel, function (value) {
      if (value != old) {
        const result = await add(value);
        old = value;
        console.log(result); // 保存されたレコード
      }
    });
  }, 1000);
};

try {
  main();
}catch(e) {
  console.log('Error', e);
}
