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

  async function port_port__structured() {
    let reqId = seq++;
    let deferred = defer();
    cache.set(reqId, deferred);
    port.postMessage({ type: 'port_port__structured', reqId });
    let result = await deferred;
    cache.delete(reqId);
    return result;
  }

  function port_sab__custom() {
    Atomics.store(accessor, 0, 0);
    port.postMessage({ type: 'port_sab__custom' });
    Atomics.wait(accessor, 0, 0);
    return {
      x: accessor[1],
      y: accessor[2],
      width: accessor[3],
      height: accessor[4],
      left: accessor[5],
      right: accessor[6],
      top: accessor[7],
      bottom: accessor[8],
    };
  }

  function port_sab__cbor() {
    Atomics.store(accessor, 0, 0);
    port.postMessage({ type: 'port_sab__cbor' });
    Atomics.wait(accessor, 0, 0);
    let length = binaryView[4];
    let subarray = binaryView.slice(5, length + 5);
    return CBOR.decode(subarray);
  }

  console.log('port_port__structured', await port_port__structured());
  console.log('port_sab__custom', port_sab__custom());
  console.log('port_sab__cbor', port_sab__cbor());

  let bench1 = new Bench()
    .add('port_port__structured', async () => {
      await port_port__structured();
    })
    .add('port_sab__custom', () => {
      port_sab__custom();
    })
    .add('port_sab__cbor', () => {
      port_sab__cbor();
    });

  await bench1.run();
  console.table(bench1.table());

  console.log('Then, run seperated suite for fully blocking communication');

  function sab_sab__custom() {
    Atomics.store(accessor, 0, -1);
    Atomics.notify(accessor, 0);
    Atomics.wait(accessor, 0, -1);
    return {
      x: accessor[1],
      y: accessor[2],
      width: accessor[3],
      height: accessor[4],
      left: accessor[5],
      right: accessor[6],
      top: accessor[7],
      bottom: accessor[8],
    };
  }

  function sab_sab__cbor() {
    Atomics.store(accessor, 0, -2);
    Atomics.notify(accessor, 0);
    Atomics.wait(accessor, 0, -2);
    let length = binaryView[4];
    let subarray = binaryView.slice(5, length + 5);
    return CBOR.decode(subarray);
  }

  port.postMessage({ type: 'blocking_start' });
  Atomics.store(accessor, 0, 0);
  Atomics.wait(accessor, 0);

  console.log('sab_sab__custom', sab_sab__custom());
  console.log('sab_sab__cbor', sab_sab__cbor());

  let bench2 = new Bench()
    .add('sab_sab__custom', () => {
      sab_sab__custom();
    })
    .add('sab_sab__cbor', () => {
      sab_sab__cbor();
    });

  await bench2.run();
  console.table(bench2.table());

  // terminate loop
  Atomics.store(accessor, 0, -99);
  Atomics.notify(accessor, 0);
}
