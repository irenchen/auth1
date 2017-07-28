const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/user');

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

// const { UserSchema } = require('./db');
const User = mongoose.model('User', UserSchema);

User.authenticate('allen@cc.com', '123', function(err, user) {
    if(err) return console.log(err);
    console.log(user.email);
});


setTimeout(() => {
    mongoose.connection.close();
}, 2000);


