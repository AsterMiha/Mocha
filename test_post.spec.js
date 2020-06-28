var assert = require('assert');
var Reqester = require('requester');

var requester = new Reqester();
const url = 'http://localhost:3000/events';

describe('POST', function () {
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

	it('Add event', function (done) {
		var test_id = "500";
		new_event.data.id = test_id;
		requester.post(url, new_event, function(response) {
			assert.equal(this.statusCode, 201);

			requester.get(url+'/'+test_id, function(response) {
				assert.equal(this.statusCode, 200);
				var event = JSON.parse(response);
				assert.equal(event.id, test_id);
				done();
			});
		});
	});

	it('Add duplicate', function (done) {
		var test_id = "500";
		new_event.data.id = test_id;
		var init_nr = nr_events;

		requester.post(url, new_event, function(response) {
			assert.equal(this.statusCode, 201);

			requester.get(url, function(response) {
				assert.equal(this.statusCode, 200);
				var events = JSON.parse(response);
				// nu ar trebui sa poata adauga duplicate
				assert.equal(events.length, init_nr);
				done();
			});
		});
	});

	// adauga singur un id daca acesta nu se da
	it('Add without id', function (done) {
		var init_nr = nr_events;

		requester.post(url, new_event, function(response) {
			assert.equal(this.statusCode, 201);

			requester.get(url, function(response) {
				assert.equal(this.statusCode, 200);
				var events = JSON.parse(response);
				events.forEach(event =>
					assert(event.hasOwnProperty('id'), true));
				done();
			});
		});
	});

	// pastreaza si spatiile in plus
	it('Add with extra field', function (done) {
		var init_nr = nr_events;
		var extra_param = "This shouldn't be here";
		new_event.data.extra_param = extra_param;

		requester.post(url, new_event, function(response) {
			assert.equal(this.statusCode, 201);

			requester.get(url, function(response) {
				assert.equal(this.statusCode, 200);
				var events = JSON.parse(response);
				events.forEach(event =>
					assert(event.hasOwnProperty('extra_param'), false));
				done();
			});
		});
	});

	// adauga un eveniment care are numai id
	it('Add empty event', function (done) {
		var init_nr = nr_events;
		new_event.data = '';

		requester.post(url, new_event, function(response) {
			assert.equal(this.statusCode, 201);

			requester.get(url, function(response) {
				assert.equal(this.statusCode, 200);
				var events = JSON.parse(response);
				// verifica daca sunt adaugate spatiile lipsa
				events.forEach(event =>
					assert(event.hasOwnProperty('topics'), true));
				// daca vrem sa nu se adauge deloc, folosim conditia comentata
				// assert.equal(events.length, init_nr);
				done();
			});
		});
	});

});