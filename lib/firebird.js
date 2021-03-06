// Generated by CoffeeScript 1.4.0
(function() {
  var DBI, FireBirdDriver, firebird, loglet,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  firebird = require('firebird');

  DBI = require('easydbi');

  loglet = require('loglet');

  FireBirdDriver = (function(_super) {

    __extends(FireBirdDriver, _super);

    FireBirdDriver.pool = false;

    FireBirdDriver.id = 0;

    function FireBirdDriver(key, options) {
      this.key = key;
      this.options = options;
      FireBirdDriver.__super__.constructor.call(this, this.key, this.options);
      this.connstr = this.makeConnStr(this.options);
      this.type = 'firebird';
    }

    FireBirdDriver.prototype.makeConnStr = function(options) {
      return options;
    };

    FireBirdDriver.prototype.connect = function(cb) {
      var self;
      loglet.debug("FireBirdDriver.connect", this.options);
      self = this;
      this.inner = firebird.createConnection();
      return this.inner.connect(this.options.filePath, this.options.userName || '', this.options.password || '', this.options.role || '', function(err) {
        if (err) {
          return cb(err);
        } else {
          loglet.debug("FireBirdDriver.connect:OK", self.id);
          return cb(null, self);
        }
      });
    };

    FireBirdDriver.prototype.isConnected = function() {
      var val;
      val = this.inner instanceof firebird.binding.Connection;
      loglet.debug("FireBirdDriver.isConnected", this.inner instanceof firebird.binding.Connection);
      return val;
    };

    FireBirdDriver.prototype.query = function(key, args, cb) {
      var _ref;
      loglet.debug("FireBirdDriver.query", key, args, cb);
      try {
        _ref = DBI.queryHelper.arrayify(key, args), key = _ref[0], args = _ref[1];
        return this._query(key, args, cb);
      } catch (e) {
        return cb(e);
      }
    };

    FireBirdDriver.prototype._query = function(stmt, args, cb) {
      var query, rows;
      query = this.inner.prepareSync(stmt);
      query.once('error', function(err) {
        return cb(err);
      });
      query.exec.apply(query, args);
      if (stmt.match(/^select/i)) {
        rows = [];
        return query.fetch('all', true, (function(rec) {
          return rows.push(rec);
        }), function(err, eof) {
          if (err) {
            return cb(err);
          } else {
            return cb(null, rows);
          }
        });
      } else {
        return cb(null);
      }
    };

    FireBirdDriver.prototype.exec = function(key, args, cb) {
      var _ref;
      loglet.debug("FireBirdDriver.exec", key, args);
      if (key === 'begin') {
        return this.begin(cb);
      } else if (key === 'commit') {
        return this.commit(cb);
      } else if (key === 'rollback') {
        return this.rollback(cb);
      } else {
        try {
          _ref = DBI.queryHelper.arrayify(key, args), key = _ref[0], args = _ref[1];
          return this._query(key, args, cb);
        } catch (e) {
          return cb(e);
        }
      }
    };

    FireBirdDriver.prototype.begin = function(cb) {
      return cb(null);
    };

    FireBirdDriver.prototype.commit = function(cb) {
      return this.inner.commit(function(err) {
        loglet.debug('Firebird.commit', err, cb);
        return cb(err);
      });
    };

    FireBirdDriver.prototype.rollback = function(cb) {
      return this.inner.rollback(function(err) {
        loglet.debug('Firebird.rollback', err, cb);
        return cb(err);
      });
    };

    FireBirdDriver.prototype.disconnect = function(cb) {
      try {
        this.inner.disconnect();
        return cb(null);
      } catch (e) {
        return cb(e);
      }
    };

    FireBirdDriver.prototype.close = function(cb) {
      try {
        this.inner.disconnect();
        return cb(null);
      } catch (e) {
        return cb(e);
      }
    };

    return FireBirdDriver;

  })(DBI.Driver);

  DBI.register('firebird', FireBirdDriver);

  module.exports = FireBirdDriver;

}).call(this);
