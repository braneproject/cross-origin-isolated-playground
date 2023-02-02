console.log('Hello from Worker!', location.origin);

self.addEventListener('message', e => {
  let [channel3Port, channel4Port] = e.ports;

  if (channel3Port) {
    console.log('channel 3 initialized');
  }

  channel3Port.onmessage = message => {
    channel3Port.postMessage(structuredClone(message.data));
  };

  channel4Port.onmessage = message => {
    channel4Port.postMessage(structuredClone(message.data));
  };
});
