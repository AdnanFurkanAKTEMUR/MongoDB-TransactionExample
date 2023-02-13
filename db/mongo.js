const { MongoClient } = require('mongodb')
let client
async function mongo(){
  const uri = "mongodb+srv://adnanfurkan:*****@rafyonetimi.uiemr8z.mongodb.net/?retryWrites=true&w=majority"
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