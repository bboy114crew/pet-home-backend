/**
 * Global function that will help use handle promise rejections
 */
to = function (promise) {
	return promise
		.then(data => {
			return [null, data];
		}).catch(err =>
			[pe(err)]
		);
};

pe = require('parse-error');

/**
 * Throw Error
 */
TE = function (err_message, log) { 
	if (log === true) {
		console.error(err_message);
	}

	throw new Error(err_message);
};

// error message to client
TEM = function (message) {
	throw {message}
}

/**
 * Error Web Response
 */
ReE = function (res, err, code) { 
	if (typeof err == 'object' && typeof err.message != 'undefined') {
		err = err.message;
	}

	if (typeof code !== 'undefined') res.statusCode = code;

	return res.json({success: false, error: {message: err}});
};

ReEM = function (res, err, code) { 
	if (typeof err == 'object' && typeof err.message != 'undefined') {
		err = err.message;
	}

	if (typeof code !== 'undefined') res.statusCode = code;

	return res.json({success: false, error: { message:err}});
};

ReEM2 = function (res, err, code) { 
	if (typeof err == 'object' && typeof err.message != 'undefined') {
		err = err.message;
	}

	if (typeof code !== 'undefined') res.statusCode = code;

	return res.json({success: false, error: { message2:err}});
};

/**
 * Success Web Response
 */
ReS = function (res, data, code) { 
	let send_data = {success: true};

	if (typeof data == 'object') {
		send_data = Object.assign(data, send_data);
	}

	if (typeof code !== 'undefined') res.statusCode = code;
	return res.json(send_data);
};

compareDate = function(date1, date2) {
	try {
		temp1 = new Date(date1);
		temp2 = new Date(date2);
		if (temp1.getTime() === temp2.getTime()) {
			return true;
		}
		return false;
	}catch (e) {
		return false;
	}
};

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
	console.error('Uncaught Error', pe(error));
});
