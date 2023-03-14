import { TWorker } from '../../types';
import { indexSearchProcessor } from './processor';

export default { name: 'indexSearch', processor: indexSearchProcessor } as TWorker;
