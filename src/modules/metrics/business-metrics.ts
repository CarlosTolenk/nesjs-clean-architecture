import { Counter } from 'prom-client';

export const setCounterExample = new Counter({
  name: `picking_example_metric`,
  help: 'Number of total events example',
  labelNames: ['name'],
});
