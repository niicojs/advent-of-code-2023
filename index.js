import { readdirSync } from 'fs';

const last = readdirSync('days').sort().at(-1);

import('./days/' + last);
