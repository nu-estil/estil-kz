import { configUtils } from './config';
import { getDBConnectionOpts } from './utils';

const options = getDBConnectionOpts(configUtils.getConfig());

export default options;
