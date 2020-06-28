var assert = require('assert');
var Reqester = require('requester');

var requester = new Reqester();
const url = 'http://localhost:3000/events';

describe('Complex tests', function () {
	var new_event = null;
	var nr_events = 0;

	beforeEach(function () {
		new_event = {
			'data' : {
				"topics": "",
				"thumbnail": "/img/tr-3.jpeg",
				"url": "index.html",
				"overrideURL": "",
				"linkType": "",
				"title": "Updated by Postman",
				"summary": "Lorem ipsum dolor sit amet"
			}
		};

		requester.get(url, function(response) {
			var events = JSON.parse(response);
			nr_events = events.length;
		});
	});

	it('Modify added event', function (done) {
		var test_id = "222";
		new_event.data.id = test_id;

		requester.post(url, new_event, function(response) {
			assert.equal(this.statusCode, 201);

			requester.get(url+'/'+test_id, function(response) {
				assert.equal(this.statusCode, 200);
				var event = JSON.parse(response);
				old_topic = event.topic;
				new_event.data.topic = event.topic+"!new";
			
				requester.put(url+'/'+test_id, new_event, function(response){
					assert.equal(this.statusCode, 200);

					requester.get(url+'/'+test_id, function(response){
						assert.equal(this.statusCode, 200);
						var event = JSON.parse(response);
						assert.equal(event.topic, new_event.data.topic);
						done();					
					});
				});
			});
		});
	});

	// apar probleme cand se permit id-uri duplicate
	it('Modify deleted event', function (done) {
		var test_id = "10";

		requester.del(url+'/'+test_id, function(response) {
			assert.equal(this.statusCode, 200);

			requester.get(url+'/'+test_id, function(response) {
				assert.equal(this.statusCode, 200);

				var event = JSON.parse(response);
				assert.equal(event.hasOwnProperty('error'), true);
				assert.equal(event.error, 'Id not found');

				requester.put(url+'/'+test_id, new_event, function(response){
					assert.equal(this.statusCode, 200);
					var event = JSON.parse(response);
					assert.equal(event.hasOwnProperty('error'), true);
					assert.equal(event.error, 'Id not found');
					done();
				});
			});
		});
	});

	it('Delete added event', function (done) {
		var test_id = "111";
		new_event.data.id = test_id;

		requester.post(url, new_event, function(response) {
			assert.equal(this.statusCode, 201);

			requester.get(url+'/'+test_id, function(response) {
				assert.equal(this.statusCode, 200);
				var event = JSON.parse(response);
				assert.equal(event.hasOwnProperty('error'), false);
			
				requester.del(url+'/'+test_id, new_event, function(response){
					assert.equal(this.statusCode, 200);

					requester.get(url+'/'+test_id, function(response){
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

	it('Delete modified event', function (done) {
		var old_topic = "";
		var test_id = "8";
		new_event.data.id = test_id;

    	requester.get(url+'/'+test_id, function(response) {
			assert.equal(this.statusCode, 200);
			var event = JSON.parse(response);
			old_topic = event.topic;
			new_event.data.topic = event.topic+"!new";
			
			requester.put(url+'/'+test_id, new_event, function(response){
				assert.equal(this.statusCode, 200);

				requester.get(url+'/'+test_id, function(response){
					assert.equal(this.statusCode, 200);
					var event = JSON.parse(response);
					assert.equal(event.topic, new_event.data.topic);
					
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
		});
	});

});
