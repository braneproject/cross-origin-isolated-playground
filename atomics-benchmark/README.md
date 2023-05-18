# Atomics Throughput Benchmark

Test the throughput of requesting structured data from a worker thread to the host. In this benchmark, it requests the result of `getBoundingClientRect()` in the host DOM in 5 ways:

1. `port_port__structured`: Request to the main thread via [`MessagePort`], and sync the result via the same `MessagePort`. Use the standard [structured clone](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) algorithm for data serialization/deserialization.
2. `port_sab__custom`: Request to the main thread via [`MessagePort`], and sync the result via [`SharedArrayBuffer`] and [`Atomics.wait`]. Use hand-written data seriallization/deserialization.
3. `port_sab__cbor`: Request to the main tread via [`MessagePort`], and sync the result via [`SharedArrayBuffer`] and [`Atomics.wait`]. Use [CBOR] for data serialization/deserialization.
4. `sab_sab__custom`: Request to the main trhead via [`SharedArrayBuffer`], blocked by [`Atomics.waitAsync`] loop, and sync the result via the same [`SharedArrayBuffer`] and [`Atomics.wait`]. Use hand-written data serialization/deserialization.
5. `sab_sab__cbor`: Request to the main trhead via [`SharedArrayBuffer`], blocked by [`Atomics.waitAsync`] loop, and sync the result via the same [`SharedArrayBuffer`] and [`Atomics.wait`]. Use [CBOR] for data serialization/deserialization.

## Result

Tested on Chrome 113, M1 MacBook Pro (arm64)

| Task Name               | ops/sec | Average Time (ns)  | Margin | Samples |
| :---------------------- | ------: | -----------------: | -----: | ------: |
| `port_port__structured` | 24,980  | 40032.025620496395 | ±2.57% | 12490   |
| `port_sab__custom`      | 46,396  | 21553.24740537882  | ±2.71% | 23203   |
| `port_sab__cbor`        | 35,492  | 28174.647881951132 | ±2.91% | 17750   |
| `sab_sab__custom`       | 35,990  | 27784.876925686054 | ±2.59% | 17999   |
| `sab_sab__cbor`         | 30,683  | 32590.27506969165  | ±3.77% | 15342   |

## Note

Using [`Atomics`] where possible yields an approximate 1.5x throughput increase.

Using [`Atomics`] also enable blocking-style data synchronization, which is required in certain cases like `getBoundingClientRect()`.

Using a general-purpose binary codec like [CBOR] for data serialization/deserialization adds 1.2x overhead on average, but helps reducing code size.

Using [`Atomics.waitAsync`] in the main thread for custom scheduling would not be faster than using [`MessagePort`].

[`MessagePort`]: https://developer.mozilla.org/en-US/docs/Web/API/MessagePort
[structured clone]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
[`SharedArrayBuffer`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
[`Atomics`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics
[`Atomics.wait`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait
[`Atomics.waitAsync`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/waitAsync
[CBOR]: https://cbor.io/
