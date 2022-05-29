//load test environment variables
const path = require('path');
require('dotenv').config({path:path.resolve(process.cwd(),"test.env"),override:true});