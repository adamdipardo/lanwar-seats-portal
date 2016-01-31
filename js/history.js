var createHistory = require('history').createHistory
var useQueries = require('history').useQueries
module.exports = useQueries(createHistory)();