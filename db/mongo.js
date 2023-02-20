const { MongoClient } = require('mongodb')
let client
async function mongo(){
  //atlas url
  //const uri = "mongodb+srv://@rafyonetimi.uiemr8z.mongodb.net/counter"
  //const uri = "mongodb://localhost:27017/counter"
  const uri = "mongodb://test-user:test-pass@localhost:27011/?replicaSet=replicaset-example&serverSelectionTimeoutMS=2000&authSource=admin&appName=mongosh+1.6.1/counter"
  client = new MongoClient(uri)
  try{
    await client.connect()
    console.log("veritabanına bağlanıldı")
  }catch(e){
    console.log("mongoya bağlınalamadı:"+e)
  }finally{
    //await client.close()
    //console.log("veritabanı bağlantısı close")
  }
}
mongo()
module.exports = client