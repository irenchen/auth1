const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/user');

const { UserSchema } = require('./db');
const User = mongoose.model('User', UserSchema);

var user1 = new User({
    email: 'allen@cc.com',
    password: '123'
});

var user2 = new User({
    email: 'bob@cc.com',
    password: '456',
});

user1.save(errHandle);
user2.save(errHandle);

function errHandle(err) {
    if(err) {
        return console.log(err);
    }
    return console.log('save one user');
}

setTimeout(() => {
    mongoose.connection.close();
}, 2000);


