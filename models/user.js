const U = module.exports = {}
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
const url = 'mongodb://localhost:27017'
const dbName = 'Shop'
var client, db, users

U.open = async function () {
    client = await MongoClient.connect(url,{useUnifiedTopology: true, useNewUrlParser: true})
    db = await client.db(dbName) // 創建名為 'project' 資料庫
    users = await db.collection('users') // 創建 db:project 下的 colletion : users
}

U.add = async function (user) {
    user.created_at = new Date() // 資料創建日期
    let r = await users.insertOne(user) // 新增一筆 user 資料
    user._id = r.insertedID
    return user
}

U.get = async function (Id) {
    let data = await users.findOne({id:Id}) // data 取得資料庫對應的帳密
    console.log("mongodb get:", data,"\n")
    return data
}

U.updateDetails = async function (u_data) {
    console.log("mongodb update:", u_data, "\n")
    let data = await users.updateOne(
        {"id": u_data.id},
        {$set: {"email": u_data.email, "phone": u_data.phone}}
    )
    return data
}

U.updatePassword = async function (user_id ,user_passwprd) {
    console.log("mongodb u_password update:", user_passwprd, "\n")
    let data = await users.updateOne(
        {"id": user_id},
        {$set: {"password": user_passwprd}}
    )
    return data
}
