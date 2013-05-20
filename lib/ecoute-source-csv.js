/* global require module */
'use strict';

var csv = require('csv'),
    glob = require('glob'),
    fs = require('fs'),
    path = require('path'),
    each = require('operandi').eachSerial
;

function Source (config) {
    this.title = config.title || 'Untitled CSV Source';
    this.file = config.file;

    if (! ('headers' in config)) {
        this.headers = true;
    }
    else {
        this.headers = config.headers;
    }
}


Source.prototype.initialize = function(done) {
    var err,
        that = this
    ;

    if (! this.file) {
        done(new Error('No file provided'));
    }
    else {
        glob(this.file, function(err, files) {
            that.files = files;

            if (files.length === 0) {
                err = new Error('File not found: ' + that.file);
            }

            done(err);
        });
    }
};


Source.prototype.refresh = function(done) {
    var data = [],
        that = this
    ;

    function callback (err) {
        done(err, data);
    }

    each(this.files, function(file, key, done) {
        var stream = csv().from.stream(fs.createReadStream(file[key]), {
            columns: that.headers
        });

        if (that.headers === false) {
            // if no headers are set the returned list will get wrapped
            // in an object and set to its key `data`.
            stream.on('record', function(row, key) {
                data.push({data: row});
            });
        }
        else {
            stream.on('record', function(row, key) {
                data.push(row);
            });
        }

        stream.on('error', function(err){
            done(err);
        });

        stream.on('end', function(count){
            done();
        });
    }, callback);
};


module.exports = function (options) {
    return (new Source(options || {}));
};
