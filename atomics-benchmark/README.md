# Atomics Throughput Benchmark

Test the throughput of requesting structured data from a worker thread to the host. In this benchmark, it requests the result of `getBoundingClientRect()` in the host DOM in 3 ways

1. Request via [`MessagePort`], and access the result as a `MessageEvent` via the same `MessagePort`. Use the standard [structured clone](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) algorithm for data serialization/deserialization.
2. Request via [`MessagePort`], and access the result from [`SharedArrayBuffer`] and [`Atomics`]. Use [CBOR] for data serialization/deserialization.
3. Request via [`MessagePort`], and access the result from [`SharedArrayBuffer`] and [`Atomics`]. Use hand-written data seriallization/deserialization.

## Result

Tested on Chrome 113, M1 MacBook Pro (arm64)

| Task Name                  | ops/sec | Average Time (ns) | Margin | Samples |
| :------------------------- | ------: | ----------------: | -----: | ------: |
| `requestViaPort`           | 24,415  | 40956.7496918757  | ±2.40% | 12208   |
| `requestViaSAB_CBOR`       | 36,680  | 27262.3200929689  | ±2.72% | 18344   |
| `requestViaSAB_structured` | 44,863  | 22290.0695056068  | ±3.00% | 22436   |

## Note

Using [`Atomics`] where possible yields an approximate 1.5x throughput increase.

Using [`Atomics`] also enable blocking-style data synchronization, which is required in certain cases like `getBoundingClientRect()`.

Using a general-purpose binary codec like CBOR for data serialization/deserialization adds 1.2x overhead on average, but helps reducing code size.

[`MessagePort`]: https://developer.mozilla.org/en-US/docs/Web/API/MessagePort
[structured clone]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
[`SharedArrayBuffer`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
[`Atomics`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics
[CBOR]: https://cbor.io/
