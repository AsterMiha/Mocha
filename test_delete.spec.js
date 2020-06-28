var assert = require('assert');
var Reqester = require('requester');

var requester = new Reqester();
const url = 'http://localhost:3000/events';

describe('DELETE', function(){

	it('Delete existing event', function (done) {
		var test_id = "3";
		// verifica intai daca exista elementul
		requester.get(url+'/'+test_id, function(response) {
			assert.equal(this.statusCode, 200);
			var event = JSON.parse(response);
			assert.equal(event.hasOwnProperty('error'), false);

			requester.del(url+'/'+test_id, function(response) {
				assert.equal(this.statusCode, 200);

				requester.get(url+'/'+test_id, function(response) {
					assert.equal(this.statusCode, 200);
					var event = JSON.parse(response);
					assert.equal(event.hasOwnProperty('error'), true);
					assert.equal(event.error, 'Id not found');
					done();
				});
			});
		});
	});

	it('Delete event not in list', function (done) {
		var test_id = "3";

		requester.get(url+'/'+test_id, function(response) {
			assert.equal(this.statusCode, 200);
			var event = JSON.parse(response);
			assert.equal(event.hasOwnProperty('error'), true);
			assert.equal(event.error, 'Id not found');

			requester.del(url+'/'+test_id, function(response) {
				console.log(response);
				assert.equal(this.statusCode, 200);
				var event = JSON.parse(response);
				assert.equal(event.hasOwnProperty('error'), true);
				assert.equal(event.error, 'Id not found');
				done();
			});
		});
	});

	it('Delete twice', function (done) {
		var test_id = "7";
		// verifica intai daca exista elementul
		requester.get(url+'/'+test_id, function(response) {
			assert.equal(this.statusCode, 200);
			var event = JSON.parse(response);
			assert.equal(event.hasOwnProperty('error'), false);

			requester.del(url+'/'+test_id, function(response) {
				assert.equal(this.statusCode, 200);

				requester.get(url+'/'+test_id, function(response) {
					assert.equal(this.statusCode, 200);
					var event = JSON.parse(response);
					assert.equal(event.hasOwnProperty('error'), true);
					assert.equal(event.error, 'Id not found');

					// sterge iar
					requester.del(url+'/'+test_id, function(response) {
						assert.equal(this.statusCode, 200);
						var event = JSON.parse(response);
						assert.equal(event.hasOwnProperty('error'), true);
						assert.equal(event.error, 'Id not found');
						done();
					});
				});
			});
		});
	});
});