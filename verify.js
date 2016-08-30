var verify = require('validate.js'),
_ = require('lodash'),
moment = require('moment');

verify.validators.optional = function(value, options, key, attributes) {
  var other_keys = options.keys || [];
  if(_.isArray(options)) {
    other_keys = options;
  }
  if(value || !other_keys) {
    return undefined;
  } else {
    var is_missing = _.chain(attributes).keys().intersection(other_keys).isEmpty().value();
    if (is_missing) {
      return options.message || ". One of the following keys must be defined if " + key + " is not defined : " + String(other_keys);
    } else {
      return undefined;
    }
  }
};

verify.validators.requires = function(value, options, key, attributes) {
  var required_keys = options.keys || [];
  if(_.isArray(options)) {
    required_keys = options;
  }
  if(_.isNil(value) || !required_keys) {
    return undefined;
  } else {
    var requirements_met = _.chain(attributes).keys().intersection(required_keys).value().length == required_keys.length;
    if(!requirements_met) {
      return options.message || "requires " + String(required_keys) + " to be defined.";
    } else {
      return undefined;
    }
  }
}

verify.validators.isArray = function(value, options, key, attributes) {
  if (_.isNil(value)) {
    return undefined;
  }
  var child_validator = options.values || function(value, index, collection) { return true; }
  var is_array = _.isArray(value);
  if(is_array && _.every(value, child_validator)) {
    return undefined;
  } else if (!is_array) {
    return options.notArray || "is not an array";
  } else {
    return options.notValidType || "Elements inside the value does not match the desired type";
  }
};

verify.validators.isString = function(value, options, key, attributes) {
  if (_.isNil(value)) {
    return undefined;
  }
  var is_string = _.isString(value);
  if (is_string) {
    return undefined;
  } else {
    return options.notString || "is not a string";
  }
};

verify.extend(verify.validators.datetime, {
  parse: function(value, options) {
    return +moment.utc(value);
  },

  format: function(value, options) {
    var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
    return moment.utc(value).format(format);
  }
});

module.exports = verify;