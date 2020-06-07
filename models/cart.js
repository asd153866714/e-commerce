const C = module.exports = {}
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
const url = 'mongodb://localhost:27017'
const dbName = 'project'
var client, db, carts

C.open = async function () {
    client = await MongoClient.connect(url,{useUnifiedTopology: true, useNewUrlParser: true})
    db = await client.db(dbName) // 創建名為 'project' 資料庫
    carts = await db.collection('carts') // 創建 db: project 下的 colletion: carts
}

C.addItem = async function (user, p_data) {
    let r = await carts.insertOne({
        "user_id": user, 
        "name": p_data.name, 
        "price": p_data.price, 
        "amount": Number(p_data.amount)
    }) 
    return r
}

C.getProduct = async function (user, p_data){
    let data = await carts.findOne({"user_id": user, "name": p_data.name})
    return data
}

C.addAmount = async function(user, p_data){
    let amount = Number(p_data.amount)   
    let old_data = await carts.findOne({"user_id": user, "name": p_data.name})
    let old_amount = Number(old_data.amount)
    let new_amount = amount + old_amount
    console.log("new_amount",new_amount)

    let data = await carts.updateOne(
        {"user_id": user, "name": p_data.name},
        {$set: {"user_id": user, "name": p_data.name, "price": p_data.price, "amount": new_amount}}
    )
    return data
}

C.updateAmount = async function (user, p_name, p_amount) {
    let data = await carts.updateOne(
        {"user_id": user, "name": p_name},
        {$set: {"user_id": user, "name": p_name, "amount": p_amount}}
    )
    return data
}

C.getCart = async function(user){
    let data = await carts.find({"user_id": user})
    return data
}

C.remove = async function(user, p_name){
    let data = await carts.remove({"user_id": user, "name": p_name})
    return data
}