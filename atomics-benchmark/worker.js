console.log('Hello from Worker!', location.origin);

self.addEventListener('message', e => {
  let [port] = e.ports;
  if (port) {
    port.onmessage = e => {
      let sab = e.data.sab;
      if (sab) {
        benchmark(port, sab);
      }
    }
    port.postMessage({ type: 'sab' });
  }
});

import { defer } from '/node_modules/@cometjs/core/lib/index.mjs';
import * as CBOR from '/node_modules/cbor-x/index.js';
import { Bench } from '/node_modules/tinybench/dist/index.js';

async function benchmark(port, sab) {
  console.log('Benchmark initialized', { port, sab });

  let seq = 0;
  let cache = new Map();
  let accessor = new Int32Array(sab);
  let binaryView = new Uint8Array(sab);

  port.onmessage = e => {
    if (e.data.type === 'resolve') {
      cache.get(e.data.reqId)?.resolve(e.data.result);
    }
  };

  async function requestViaPort() {
    let reqId = seq++;
    let deferred = defer();
    cache.set(reqId, deferred);
    port.postMessage({ type: 'requestViaPort', reqId });
    let result = await deferred;
    cache.delete(reqId);
    return result;
  }

  function requestViaSAB_structured() {
    Atomics.store(accessor, 0, 0);
    port.postMessage({ type: 'requestViaSAB_structured' });
    Atomics.wait(accessor, 0, 0);
    return {
      x: accessor[0],
      y: accessor[1],
      width: accessor[2],
      height: accessor[3],
      left: accessor[4],
      right: accessor[5],
      top: accessor[6],
      bottom: accessor[7],
    };
  }

  function requestViaSAB_CBOR() {
    Atomics.store(accessor, 0, 0);
    port.postMessage({ type: 'requestViaSAB_CBOR' });
    Atomics.wait(accessor, 0, 0);
    let length = binaryView[0];
    let subarray = binaryView.slice(1, length + 1);
    return CBOR.decode(subarray);
  }

  console.log('requestViaPort', await requestViaPort());
  console.log('requestViaSAB_structured', requestViaSAB_structured());
  console.log('requestViaSAB_CBOR', requestViaSAB_CBOR());

  let bench = new Bench()
    .add('requestViaPort', async () => {
      await requestViaPort();
    })
    .add('requestViaSAB_structured', () => {
      requestViaSAB_structured();
    })
    .add('requestViaSAB_CBOR', () => {
      requestViaSAB_CBOR();
    });


  await bench.run();
  console.table(bench.table());
}
