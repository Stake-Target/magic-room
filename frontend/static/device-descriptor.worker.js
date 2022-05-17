
async function dumpPermissions () {
  // https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/modules/permissions/permission_descriptor.idl
  const permissions = [
    'storage-access',
    'push',
    'speaker',
    'device-info',
    'bluetooth',
    'midi',
    'background-fetch',
    'background-sync',
    'accelerometer',
    'gyroscope',
    'magnetometer',
    'screen-wake-lock',
    'clipboard',
    'clipboard-read',
    'clipboard-write',
    'payment-handler',
    'periodic-background-sync',
    'geolocation',
    'notifications',
    'camera',
    'microphone',
    'display-capture',
    'persistent-storage',
    'ambient-light-sensor',
    'accessibility-events',
    'nfc',
    'idle-detection',
    'system-wake-lock',
    'window-placement',
    'font-access',
  ];

  const result = {};

  await Promise.all(
    permissions.map(e => new Promise(resolve => {
      // noinspection JSCheckFunctionSignatures
      navigator.permissions.query({name: e})
        .then(({state}) => {
          result[e] = {state};
          resolve();
        })
        .catch((ex) => {
          result[e] = {
            'exType': ex.constructor.name,
            'msg': ex.message,
          };
          resolve();
        });
    }))
  );

  return result;
}

onmessage = async function(event) {
  const {action, payload} = event.data
  const ACTIONS = { dumpPermissions }
  const fn = ACTIONS[action]
  if (fn) {
    const result = await fn(payload);
    postMessage({ action, result });
  } else {
    postMessage({ action, result: null });
  }
}
