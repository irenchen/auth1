const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Hash = require('password-hash');

var UserSchema = new Schema({
    email: { type: String },
    password: {
        type: String,
        set: function(newValue) {
            return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
        },
    },

});

UserSchema.statics.authenticate = function(email, password, callback) {
    this.findOne({ email: email }, (err, user) => {
        if(user && Hash.verify(password, user.password)) {
            callback(null, user);
        } else if(user || !err) {
            var error = new Error('incorrect, please try again');
            callback(error, null);
        } else {
            callback(err, null);
        }
    });
};

module.exports = {
    UserSchema,
};


