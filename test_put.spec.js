var assert = require('assert');
var Reqester = require('requester');

var requester = new Reqester();
const url = 'http://localhost:3000/events';

describe('PUT', function () {
	var new_event = null;
	var nr_events = 0;

	beforeEach(function () {
		new_event = {
			'data' : {
				"id": "333",
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

	it('Update existing event', function (done) {
		var old_topic = "";
		var test_id = "1";
		new_event.data.id = test_id;

    	requester.get(url+'/'+test_id, function(response) {
			assert.equal(this.statusCode, 200);
			var event = JSON.parse(response);
			old_topic = event.topic;
			// adauga la continutul vechi ca sa ne asiguram
			// ca sunt siruri diferite
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

	it('Update event not in the list', function (done) {
		var test_id = "333";
		new_event.data.id = test_id;

    	requester.get(url+'/'+test_id, function(response) {
			assert.equal(this.statusCode, 200);
			var event = JSON.parse(response);
			assert.equal(event.hasOwnProperty('error'), true);
			assert.equal(event.error, 'Id not found');
			
			// ar trebui ca operatia sa returneze un cod de succes
			// dar sa aiba un mesaj de eroare in raspuns
			requester.put(url+'/'+test_id, new_event, function(response){
				assert.equal(this.statusCode, 200);
				var event = JSON.parse(response);
				assert.equal(event.hasOwnProperty('error'), true);
				assert.equal(event.error, 'Id not found');
				done();
			});
		});
	});

	// nu permite schimbarea id-ului
	it('Change id of event', function (done) {
		var test_id = "1";

		requester.get(url+'/'+test_id, function(response) {
			assert.equal(this.statusCode, 200);

			requester.put(url+'/'+test_id, new_event, function(response){
				assert.equal(this.statusCode, 200);
				
				requester.get(url+'/'+new_event.data.id, function(response){
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