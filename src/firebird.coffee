
firebird = require 'firebird'
DBI = require 'easydbi'
loglet = require 'loglet'

class FireBirdDriver extends DBI.Driver
  @pool = false
  @id = 0
  constructor: (@options) ->
    super @options
    @connstr = @makeConnStr @options
  makeConnStr: (options) ->
    options
  connect: (cb) ->
    loglet.debug "FireBirdDriver.connect", @options
    self = @
    @inner = firebird.createConnection()
    @inner.connect @options.filePath, @options.userName or '', @options.password or '', @options.role or '', (err) ->
      if err
        cb err
      else
        loglet.debug "FireBirdDriver.connect:OK", self.id
        cb null, self
  isConnected: () ->
    val = @inner instanceof firebird.binding.Connection
    loglet.debug "FireBirdDriver.isConnected", @inner instanceof firebird.binding.Connection
    val
  query: (key, args, cb) ->
    loglet.debug "FireBirdDriver.query", key, args, cb
    try 
      [ key, args ] = DBI.queryHelper.arrayify key, args
      @_query key, args, cb
    catch e
      cb e
  _query: (stmt, args, cb) ->
    query = @inner.prepareSync stmt
    query.once 'error', (err) -> cb err
    query.exec args...
    if stmt.match /^select/i
      rows = []
      query.fetch 'all', true, ((rec) -> rows.push(rec)), (err, eof) ->
        if err
          cb err
        else
          cb null, rows
    else
      cb null
  exec: (key, args, cb) ->
    loglet.debug "FireBirdDriver.exec", key, args
    if key == 'begin'
      @begin cb
    else if key == 'commit'
      @commit cb
    else if key == 'rollback'
      @rollback cb
    else
      try 
        [ key, args ] = DBI.queryHelper.arrayify key, args
        @_query key, args, cb 
      catch e
        cb e
  begin: (cb) ->
    cb null
#    @inner.begin cb 
  commit: (cb) ->
    @inner.commit (err) ->
      loglet.debug 'Firebird.commit', err, cb
      cb err
  rollback: (cb) ->
#    cb null
    @inner.rollback (err) ->
      loglet.debug 'Firebird.rollback', err, cb
      cb err
  disconnect: (cb) ->
    try 
      @inner.disconnect()
      cb null 
    catch e
      cb e
  close: (cb) ->
    try 
      @inner.disconnect()
      cb null 
    catch e
      cb e

DBI.register 'firebird', FireBirdDriver

module.exports = FireBirdDriver
