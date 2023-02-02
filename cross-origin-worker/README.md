# `MessageChannel` Communication Benchmark

## How to run

Run below commands each in different shell.

```bash
yarn start:parent
```

```bash
yarn start:child
```

```bash
open http://localhost:8000
```

## Results

Ran in Google Chrome v109.0 (arm64), MacBook N1 Pro

### Bench 1 - echo

Result:

| Task Name                                                    |  Average Time (ps) |      Variance (ps) |
| :----------------------------------------------------------- | -----------------: | -----------------: |
| `echo1(): parent <-> parent`                                 |  9.365049638949568 | 0.0705214306830679 |
| `echo2(): parent <-> cross-origin iframe`                    | 23.875626662688713	| 0.6639506744485786 |
| `echo3(): parent <-> cross-origin worker`                    |  38.38963530914797 | 0.7206951695428133 |
| `echo4(): parent <-> cross-origin iframe (relay) <-> worker` |  23.47101621562342 | 0.6563361262046872 |

### Bench 2 - echo with complex object

Result:

| Task Name                                                           |  Average Time (ps) |      Variance (ps) |
| :------------------------------------------------------------------ | -----------------: | -----------------: |
| `echo1(complex): parent <-> parent`                                 | 10.384176095479399 | 0.8827124304720941 |
| `echo2(complex): parent <-> cross-origin iframe`                    | 30.261724709382396 |  42.26730200256161 |
| `echo3(complex): parent <-> cross-origin worker`                    | 42.147071199280475 |  1.481086892907074 |
| `echo4(complex): parent <-> cross-origin iframe (relay) <-> worker` |  28.22890201851099 | 1.3999961481541494 |

### Bench 3 - 100 echo concurrently with complex object

Result:

| Task Name                                                                |  Average Time (ps) |      Variance (ps) |
| :----------------------------------------------------------------------- | -----------------: | -----------------: |
| `echo1(complex) x100: parent <-> parent`                                 |  556.6111111806499 | 15.710801706736985 |
| `echo2(complex) x100: parent <-> cross-origin iframe`                    |  2210.869565282179 | 175.13032078624855 |
| `echo3(complex) x100: parent <-> cross-origin worker`                    | 1703.5593221248207 | 3251.8246154878448 |
| `echo4(complex) x100: parent <-> cross-origin iframe (relay) <-> worker` | 2217.9347824143324 | 212.67895227415397 |
