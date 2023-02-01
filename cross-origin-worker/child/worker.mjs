console.log('Hello from Worker!', location.origin);

self.addEventListener('message', e => {
  let [channel3Port] = e.ports;

  if (channel3Port) {
    console.log('channel 3 initialized');
  }

  channel3Port.onmessage = message => {
    channel3Port.postMessage({ id: message.data.id });
  };
});
