/*global module*/

var googleapis = require('googleapis');
var _          = require('underscore');

module.exports = function(jarvis, module) {

	var apikey = module.config.apikey;
	var config = module.config;

	module.addAction(module.createCommand({
		name: 'Google Search',
		description: 'Performs a Google search for the query',
		example: "google what is a honeybadger?",
		match: new RegExp('(google|search) (.*)', 'i'),
		func: function(message, command, query) {
			googleapis.load('customsearch', 'v1', function(err, client) {
				// set api key
				if (apikey) {
					client.withApiKey(apikey);
				}
				client.search.cse.list({ q: query, cx: config.search.engine}).execute(function(err, result) {
					var reply = '';
					if (err) {
						reply = err.message;
					}
					else {
						reply = _.reduce(result.items, function(reply, item){
							return reply + item.title + "\n" + item.snippet + "\n" + item.link + "\n\n";
						}, '');
					}
					jarvis.reply(message, reply);
				});
			});
		}
	}));

	module.addAction(module.createCommand({
		name: 'Google URL shortener',
		description: 'The Google URL Shortener at goo.gl is a service that takes long URLs and squeezes them into fewer characters to make a link that is easier to share, tweet, or email to friends.',
		example: "shorten http://www.a-really-long-url-to-shorten-would-go-here.com",
		match: new RegExp('shorten (http.*)', 'i'),
		func: function(message, url) {
			googleapis.load('urlshortener', 'v1', function(err, client) {
				// set api key
				if (apikey) {
					client.withApiKey(apikey);
				}
				client.urlshortener.url.insert({ method: 'POST', longUrl: url }).execute(function (err, result) {
					var reply = '';
					if (err) {
						reply = err.message;
					}
					else {
						reply = result.id;
					}
					jarvis.reply(message, reply);
				});
			});
		}
	}));

};
