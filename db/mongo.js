const { MongoClient } = require('mongodb')
let client
async function mongo(){
  //atlas url
  const uri = ""
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