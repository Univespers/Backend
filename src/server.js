import { Endpoints } from './endpoints.js';
import { Processes } from './processes.js';
import { Datapoints } from './datapoints.js';

const processes = new Processes();
const datapoints = new Datapoints(processes);
const endpoints = new Endpoints(processes, datapoints);

endpoints.start();
