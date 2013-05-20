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

buster.testCase('A CSV source', {
    'should implement a refresh function': function () {
        var test = new Source();

        assert.isFunction(test.refresh);
    },
    'should implement an initialize function': function () {
        var test = new Source();

        assert.isFunction(test.initialize);
    }
});

buster.testCase('refresh', {
    '// should call its callback method at some point': function () {
        var test = new Source(),
            callback = this.spy()
        ;

        test.refresh(callback);
        assert.calledOnce(callback);
    },
    'should parse a csv file and return its output': function (done) {
        var test = new Source();
        test.files = ['test/assets/foo.csv'];

        test.refresh(function(err, data) {
            assert.equals(data, [{foo: 'bar'}]);
            done();
        });
    },
    'should parse a csv file with headers': function (done) {
        var test = new Source();
        test.files = ['test/assets/with-header.csv'];

        test.refresh(function(err, data) {
            assert.equals(data.length, 1);
            assert.defined(data[0].year);
            assert.defined(data[0].make);
            done();
        });
    },
    'should parse a csv file without headers': function (done) {
        var test = new Source({
            headers: false
        });
        test.files = ['test/assets/without-header.csv'];

        test.refresh(function(err, data) {
            assert.equals(data.length, 3);
            done();
        });
    },
    'should wrap the returned row from a csv file without headers in the data-key of a wrapping object': function (done) {
        var test = new Source({
            headers: false
        });
        test.files = ['test/assets/without-header.csv'];

        test.refresh(function(err, data) {
            assert.defined(data[0].data);
            done();
        });
    },
    'should accept a custom set of header names in the config': function (done) {
        var test = new Source({
            headers: ['color','number','type']
        });
        test.files = ['test/assets/without-header.csv'];

        test.refresh(function(err, data) {
            assert.defined(data[0].color);
            assert.defined(data[0].number);
            assert.defined(data[0].type);
            done();
        });
    }

});

buster.testCase('initialization', {
    'should call its callback method at some point': function (done) {
        var test = new Source({});

        test.initialize(function(err) {
            assert.defined(err);
            done();
        });
    },
    'should check if the source file exist': function (done) {
        var test = new Source({
            'file': 'test/assets/foo.csv'
        });
        test.initialize(function(err) {
            refute.exception(function() {
                throw err;
            });
            done();
        });
    },
    'should return an error if the source file does not exist': function (done) {
        var test = new Source({
            'file': 'test/assets/non-existent.csv'
        });

        test.initialize(function(err) {
            assert.exception(function() {
                throw err;
            });
            done();
        });
    }
});
