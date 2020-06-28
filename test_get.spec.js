var assert = require('assert');
var Reqester = require('requester');

var requester = new Reqester();
const url = 'http://localhost:3000/events';

describe('GET', function () {

	it('Get all available events', function (done) {
		var list_size = 12;
		requester.get(url, function(response) {
			assert.equal(this.statusCode, 200);
			var events = JSON.parse(response);
			assert.equal(events.length, list_size);
			done();
		});
    });

    it('Get existing element', function (done) {
    	var test_id = 1;
    	requester.get(url+'/'+test_id, function(response) {
			assert.equal(this.statusCode, 200);
			var event = JSON.parse(response);
			assert.equal(event.id, test_id);
			done();
		});
    });

    it('Get element not in list', function (done) {
    	var test_id = 20;
    	requester.get(url+'/'+test_id, function(response) {
			assert.equal(this.statusCode, 200);
			var event = JSON.parse(response);
			assert.equal(event.hasOwnProperty('error'), true);
			assert.equal(event.error, 'Id not found');
			done();
		});
    });

});
