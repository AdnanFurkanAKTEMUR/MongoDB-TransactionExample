const transactionOptions = {
  readPreference: 'primary',
  readConcern: { level: 'majority' },
  writeConcern: { w: 'majority' }
};
let numbers = 0;
module.exports = {
  Query: {
    getResources: async (_, { input }, { req, res, client }) => {
      const session = await client.startSession()
      let resources;

      try {
        const transactionResult = await session.withTransaction(async () => {
          const resourcesCollection = await client.db("counter").collection("resources")
          resources = await resourcesCollection.findOne({ resources: input?.resources }, { session })
          
        }, transactionOptions)
        return resources ? resources : null
      } catch (e) {
        console.log("hata: "+e);
        throw new Error("hata: "+ e)
      } finally {
        await session.endSession()
      }
    },
    getAllResources: async (_, { input }, { req, res, client }) => {

      const session = client.startSession()
      let resources;

      try {
        const transactionResult = await session.withTransaction(async () => {
          const resourcesCollection = await client.db("counter").collection("resources")
          resources = await resourcesCollection.find({}, { session }).toArray()
        }, transactionOptions)
        return resources ? resources : null

      } catch (e) {
        console.log("hata: "+ e);
        throw new Error("hata: "+ e)
      } finally {
        await session.endSession()
      }
    }
  },

  Mutation: {
    createResources: async (_, { input }, { req, res, client }) => {
      const resourcesCollection = await client.db("counter").collection("resources")
      const session = await client.startSession()
      let resourcesId;

      try {
        const transactionResult = await session.withTransaction(async () => {
          const findOldData = await resourcesCollection.findOne({ resources: input?.resources }, { session })
          if (findOldData) {
            throw new Error("böyle bir veri var")
          }
          resourcesId = await resourcesCollection.insertOne({
            resources: input?.resources,
            counter: 0
          }, { session })

        }, transactionOptions)

        const resources = await resourcesCollection.findOne({ _id: resourcesId?.insertedId }, { session })
        return resources ? resources : null

      } catch (e) {
        console.log("hata: " + e);
        throw new Error("hata: "+ e)
      } finally {
        await session.endSession()
      }

    },
    updateResources: async (_, { input }, { req, res, client }) => {

      const session = await client.startSession()
      try {
        await session.withTransaction(async () => {
          const resourcesCollection = await client.db("counter").collection("resources")
          const recordCollection = await client.db("counter").collection("kayit")
          const resources = await resourcesCollection.findOneAndUpdate({ resources: input?.resources }, {
            $inc: { counter: 1 }
          }, { session })
          numbers = numbers + 1
          await recordCollection.insertOne({ res: resources.value.resources, counter: resources.value.counter, number: numbers, node: "node1" }, { session })

          console.log("numbers:" + numbers);
          if (numbers % 2 === 0) {
            throw new Error("mod")
          } else {
            return resources ? resources.value : null
          }
        }, transactionOptions);
      } catch (e) {
        console.log("hata: ", e);
        throw new Error("hata: "+ e)
      } finally {
        await session.endSession();
      }
    },
    deleteResources: async (_, { input }, { req, res, client }) => {
      const session = client.startSession()
      let resources;

      try {
        const transactionResult = await session.withTransaction(async () => {
          const resourcesCollection = client.db("counter").collection("resources")
          resources = await resourcesCollection.findOneAndDelete({ resources: input?.resources }, { session })
        }, transactionOptions)
        return resources ? resources.value : null
      } catch (e) {
        console.log("hata: " + e)
        throw new Error("hata: "+ e)
      } finally {
        await session.endSession()
      }
    },

    insertMultiDocument: async (_, __, { req, res, client }) => {
      const session = client.startSession()
      const myString = "sdaşlaşdlaşdalşsaşdsaskdfsnkjfdfjekıjewjıfdfıjsvcjsdnsldjfweoıfhewouhewokd903328239432ıuweıofjsdfhsdjfajksdfhwehr983yr3498tyeeoıhsddahgkjasdhgweohg8934thoefwk"
      try{
        await session.withTransaction(async () => {
          const multiRecordCollection = client.db("counter").collection("multi_record")
          for(let i = 0; i<50000; i++){
            
            await multiRecordCollection.insertOne({
              myString: myString,
              i: i
            }, { session })
          }
        })
        return null
      } catch(e){
        console.log("hata: " + e);
      } finally {
        await session.endSession()
      }
    }
  }
}
