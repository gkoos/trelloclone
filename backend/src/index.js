'use strict';

import { app } from './server.js';
const port = process.env.PORT;

app.listen(port);

console.log(`Trello Clone API server started on port ${port}`);
