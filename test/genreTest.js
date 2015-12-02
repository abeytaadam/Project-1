var request = require('request'),
	expect = require('chai').expect,
	baseUrl = 'http://localhost:3000';

describe('Genres', function (){
	it('should fetch all genre data on GET /', function (done){
		request(baseUrl + '/', function (error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
});