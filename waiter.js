Waiter = function() {
    /*
    constructor that creates an object that holds (and then fires) delayed events
    */
	// always create a new var, even if the 'new' keyword is omitted 
	if (!(this instanceof Waiter)) {
		return new Waiter();
	}

    var my_soup = ['fly']; // hehe, funny joke
    
	return {
		_q: [],          // queue of events
		_tmt: undefined, // timeout
	
		add_event: function(delay, callback, name, data){
		    /*
		    adds a timed event to the queue
		    sorts the queue
		    ensures the timeout is reset
		    returns true of an event is scheduled, returns false if not
		    */
            // verify arguments
			if (typeof callback !== "function") {
			    throw "Queue events must have callback function";
		    }
			delay = parseInt(delay, 10);
			if (!delay && (delay !== 0)) {
			    throw "Time argument must be a number - an number of milliseconds";
		    }
			if (delay <= 0) {
			    // event in the past? silently ignore
				return false;
			}
			// build an object
			var now = new Date().valueOf(),
			    UTCtime = now + delay,
    			evnt = {
    				'name': (name || "event" + new Date().getTime()).toString(),
    				'UTCtime': UTCtime,
    				'callback': callback,
    				'data': data
    			};
		
			// push to the array
			this._q.push(evnt);
			// sort the array
			this._q.sort(function(a, b) {
				return a['UTCtime'] - b['UTCtime'];
			});
			// reset the timeout
			this._reset_tmt();
			return true;
		},
	
		_reset_tmt: function() {
		    /*
            resets the timeout until the next event
		    */
		    clearTimeout(this._tmt);
			var that = this;
			if (this._q.length > 0) {
			    this._tmt = setTimeout(function() { that._call_event(); }, this.time_to_next());
            }
		},
	
		_call_event: function() {
		    /*
		    removes the first event from the queue and then calls it
		    */
			// remove the event
			var evnt = this._q.shift();
			if (evnt) {
    			// reset the timeout 
    			this._reset_tmt();
    			// call the callback, passing name and data
    			evnt['callback'](evnt['name'], evnt['data']);
            }
		},

		cancel_event: function(name){
			/*
			cancel event by name
			*/
			var deleted = undefined;
			// loop through the array, looking for the object
			for (var i = this._q.length - 1; i>=0 ; i--) {
				if (this._q[i]['name'] === name) {
					// remove event
					this._q.splice(i, 1);
					deleted = i;
				}
			}
			// was it the first event? reset the timeout
			if (i==0) {
				this._reset_tmt();
				return true;
			}
			if (deleted) return true;
			return false;
		},
		
		time_to_next: function() {
			/*
			time in milliseconds until the next event
			*/
			if (this._q[0]) {
				var now = new Date();
				return this._q[0].UTCtime - now.valueOf();
			}
			return undefined;
		},

		events_in_queue: function() {
		    /*
		    returns a list of names of the events in queue
		    */
			var list = [];
			for (var i=0, lim = this._q.length; i<lim ; i++) {
			    list.push(this._q[i].name);
			}
			return list;
		}
	};
};