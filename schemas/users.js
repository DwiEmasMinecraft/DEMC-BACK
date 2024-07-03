const mongoose = require(process.env.mainFile).mongoose.mongoose

const UserSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    httpauth: String,
    role: String,

    badges: Array,
    pfp: String,
    desc: String,
    MCUUID: mongoose.Schema.Types.UUID,
    discordID: Number

})

const Users = mongoose.model('Users', UserSchema)
module.exports = Users
