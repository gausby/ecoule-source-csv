/*jslint maxlen:140*/
/* global require */
'use strict';

var buster = require('buster'),
    Ecoute = require('ecoute'),
    Source = require('../lib/ecoute-source-csv')
;

var assert = buster.assertions.assert;
var refute = buster.assertions.refute;

var basicConfig = {};

buster.testCase('An Ecoute CSV source', {
    'should state the obvious': function () {
        assert.isTrue(true);
    }
});
