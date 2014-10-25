# EasyDBI-Firebird - Firebird Database Adapter for EasyDBI

[`EasyDBI`](http://github.com/yinso/easydbi) is a simple database interface for NodeJS. `easydbi-firebird` is the firebird database adapter for `easydbi`.

# Installation

    npm install easydbi
    npm install easydbi-firebird

# Usage

See [`EasyDBI`](http://github.com/yinso/easydbi) for more details on the API.

    var DBI = require('easydbi'); // already comes with sqlite3
    require('easydbi-firebird'); // for firebird
    
    DBI.setup('test', {type: 'firebird', options: {filePath: 'test.db', userName: 'SYSDBA', password:''}})
    
    // "prepare" queries. 
    DBI.prepare('test', 'createTest', {exec: 'create table test_t (c1 int, c2 int)'});
    
    DBI.connect('test', function(err, conn) { /* ... */ });
