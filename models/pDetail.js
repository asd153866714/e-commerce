const P = module.exports = {}
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
const url = 'mongodb://localhost:27017'
const dbName = 'project'
var client, db, products

P.open = async function () {
    client = await MongoClient.connect(url,{useUnifiedTopology: true, useNewUrlParser: true})
    db = await client.db(dbName) // 創建名為 'project' 資料庫
    products = await db.collection('products') // 創建 db:project 下的 colletion : users
}

P.add = async function (Pt) {
    Pt.created_at = new Date() // 資料創建日期
    let r = await products.insertOne(Pt) // 新增一筆 user 資料
    Pt._id = r.insertedID
    return Pt
}

P.get = async function (Id) {
    let data = await products.findOne({id:Id}) // data 取得資料庫對應的帳密
    console.log(data)
    return data
}

P.find = async function(){
    let data = await products.find()
    return data
}