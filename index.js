var rp = require("request-promise");
var Service, Characteristic;

module.exports = function(homebridge) {
  console.log("homebridge API version: " + homebridge.version);

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-octoprint", "Octoprint", OctoprintAccessory);
};

function OctoprintAccessory(log, config, api) {
  this.log = log;
  this.name = config["name"];
  this.server = "http://192.168.0.14:5000" || 'http://octopi.local';
  this.apiKey = "DE759639256F42F3B2F7306945821DC7";

  this.accessories = [];
  this.service = new Service.Switch("Hot End", "service1");

  this.service
    .getCharacteristic(Characteristic.On)
    .on('set', this.setOnCharacteristicHandler.bind(this))
    .on('get', this.getOnCharacteristicHandler.bind(this));
		
  this.serviceBed = new Service.Switch("Printer Bed", "service0");

  this.serviceBed
    .getCharacteristic(Characteristic.On)
    .on('set', this.setOnCharacteristicBedHandler.bind(this))
    .on('get', this.getOnCharacteristicBedHandler.bind(this));
    
  this.serviceConnect = new Service.Switch("Connect", "service2");

  this.serviceConnect
    .getCharacteristic(Characteristic.On)
    .on('set', this.setOnCharacteristicConnectionHandler.bind(this))
    .on('get', this.getOnCharacteristicConnectionHandler.bind(this));
    
    
  this.serviceExtrude = new Service.Switch("Extrude", "service3");

  this.serviceExtrude
    .getCharacteristic(Characteristic.On)
    .on('set', this.setOnCharacteristicExtrudeHandler.bind(this))
    .on('get', this.getOnCharacteristicExtrudeHandler.bind(this));
    
  this.serviceRetract = new Service.Switch("Retract", "service4");

  this.serviceRetract
    .getCharacteristic(Characteristic.On)
    .on('set', this.setOnCharacteristicRetractHandler.bind(this))
    .on('get', this.getOnCharacteristicRetractHandler.bind(this));
      
};

OctoprintAccessory.prototype.setOnCharacteristicExtrudeHandler = function(value, callback) {
  this.log(`calling setOnCharacteristicHandler`, value)

	var options = {
		method: 'POST',
		uri: this.server + '/api/printer/tool',
		headers: { "X-Api-Key": this.apiKey },
		body: { "command": "extrude", "amount" : 50},
		json: true
	};

	rp(options).then(function() {
		console.log('Successfully extruded');
		callback(null);
	}).catch(function(error) {
		console.log('==== ERROR IN EXTRUDE ====');
		callback(error);
	});
};

OctoprintAccessory.prototype.setOnCharacteristicRetractHandler = function(value, callback) {
  this.log(`calling setOnCharacteristicHandler`, value)
  var options = {
		method: 'POST',
		uri: this.server + '/api/printer/tool',
		headers: { "X-Api-Key": this.apiKey },
		body: { "command": "extrude", "amount" : -50},
		json: true
	};

	rp(options).then(function() {
		console.log('Successfully retracted');
		callback(null);
	}).catch(function(error) {
		console.log('==== ERROR IN RETRACT ====');
		callback(error);
	});
};

OctoprintAccessory.prototype.setOnCharacteristicBedHandler = function(value, callback) {
  this.log(`calling setOnCharacteristicHandler`, value)
  var temp = 0;

	if (value) {
		temp = 112;
	}

	var options = {
		method: 'POST',
		uri: this.server + '/api/printer/bed',
		headers: { "X-Api-Key": this.apiKey },
		body: { "command": "target", "target" : temp},
		json: true
	};

	rp(options).then(function() {
		console.log('Successfully set target temperature to ' + temp);
		callback(null);
	}).catch(function(error) {
		console.log('==== ERROR IN SET TEMP ====');
		callback(error);
	});

  callback(null)
};

OctoprintAccessory.prototype.getOnCharacteristicBedHandler = function(callback) {
  this.log(`calling getOnCharacteristicHandler`, this.isOn)
  callback(null, this.isOn)
}

OctoprintAccessory.prototype.getOnCharacteristicExtrudeHandler = function(callback) {
  this.log(`calling getOnCharacteristicHandler`, this.isOn)
  callback(null, this.isOn)
}

OctoprintAccessory.prototype.getOnCharacteristicRetractHandler = function(callback) {
  this.log(`calling getOnCharacteristicHandler`, this.isOn)
  callback(null, this.isOn)
}

OctoprintAccessory.prototype.setOnCharacteristicHandler = function(value, callback) {
  this.log(`calling setOnCharacteristicHandler`, value)
  var temp = 0;

	if (value) {
		temp = 210;
	}

	var options = {
		method: 'POST',
		uri: this.server + '/api/printer/tool',
		headers: { "X-Api-Key": this.apiKey },
		body: { "command": "target","targets": { "tool0": temp}},
		json: true
	};

	rp(options).then(function() {
		console.log('Successfully set target temperature to ' + temp);
		callback(null);
	}).catch(function(error) {
		console.log('==== ERROR IN SET TEMP ====');
		callback(error);
	});

  callback(null)
};


OctoprintAccessory.prototype.getOnCharacteristicConnectionHandler = function(callback) {
  this.log(`calling getOnCharacteristicHandler`, this.isOn)
  callback(null, this.isOn)
}

OctoprintAccessory.prototype.setOnCharacteristicConnectionHandler = function(value, callback) {
  this.log(`calling setOnCharacteristicHandler`, value)
  var connectCmd = "disconnect";

	if (value) {
		connectCmd = "connect";
	}

	var options = {
		method: 'POST',
		uri: this.server + '/api/connection',
		headers: { "X-Api-Key": this.apiKey },
		body: {"command": connectCmd},
		json: true
	};

	rp(options).then(function() {
		callback(null);
	}).catch(function(error) {
		console.log('==== ERROR IN CONNECTION ====');
		callback(error);
	});

  callback(null)
};

OctoprintAccessory.prototype.getOnCharacteristicHandler = function(callback) {

  this.log(`calling getOnCharacteristicHandler`, this.isOn)
  callback(null, this.isOn)
}

OctoprintAccessory.prototype.getServices = function() {
  return [this.service, this.serviceBed, this.serviceConnect, this.serviceExtrude, this.serviceRetract];
};


