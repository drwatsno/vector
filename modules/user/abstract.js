// db abstraction layer

var db = require("../../components/mdb");
var crypto = require("crypto");

var userSchema = new db.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    secret: {
        type: String,
        unique: false,
        required: false
    },
    role: {
        type: Number,
        unique: false,
        required: true,
        default: 10
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.encryptSecret = function (secret) {
    return crypto.createHmac('sha512',secret).digest('hex');
};

userSchema.methods.checkSecret = function (secret) {
    return (this.encryptSecret(secret) == this.secret);
};

userSchema.virtual('password')
    .get(function () {
        return this.secret;
    })
    .set(function (secret) {
        this.secret = this.encryptSecret(secret);
    });

var UserDbAbstraction = db.model("User", userSchema);

module.exports = UserDbAbstraction;