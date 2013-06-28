Waiter.js
=========

Manager for a queue of delayed events.

This was written for a project whereby information about events happening in a radio broadcast was being received via a websocket so that relevant information could be displayed in line with what users could hear happening in an audio stream.

Websocket events were almost live, the radio stream was subject to delays in encoding, decoding and down to the amount of data in the client buffer.

Additionally, we'd be receiving WebSocket data about 'pending' events that we'd need to delay dependent on a timestamp in the event data. Sounds fun doesn't it? ;)

Rather than habing multiple timeouts initialised everytime we got a websocket event, I wrote this simple JavaScript queue.

It started life as a gist: https://gist.github.com/gareth53/5795304 but once I wrote some tests and a demo it graduated here.
