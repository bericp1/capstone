module.exports = {
  /**
   * How long should tokens live?
   * Default: 1000*60*60*24*14 (Two weeks)
   */
  tokenTTL: 1000*60*60*24*14,

  /**
   * The size in bytes of the token (before hex)
   */
  tokenBytes: 24
};