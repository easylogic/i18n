#!/usr/bin/env node

require('./auth')(() => {
    console.log('Starting googleapi authentication...');
});