const { GraphQLError } = require('graphql')

const transactionOptions = {
  readPreference: 'primary',
  readConcern: { level: 'majority' },
  writeConcern: { w: 'majority' }
};

module.exports = {
  Query: {
    getResources: async (_, { input }, { req, res, client }) => {
      const resourcesCollection = await client.db("counter").collection("resources")
      const session = await client.startSession()
      let resources;

      try {
        const transactionResult = await session.withTransaction(async () => {
          resources = await resourcesCollection.findOne({ resources: input?.resources }, { session })
        }, transactionOptions)
        if (transactionResult) {
          return resources ? resources : null
        } else {
          await session.abortTransaction()
          return null
        }
      } catch (e) {
        console.log("hata");
        //session.abortTransaction() otomatik abort ediyor
        throw GraphQLError("bir hata oluştu")
      } finally {
        await session.endSession()
      }
    },
    getAllResources: async (_, { input }, { req, res, client }) => {
      const resourcesCollection = await client.db("counter").collection("resources")
      const session = client.startSession()
      let resources;

      try {
        const transactionResult = await session.withTransaction(async () => {
          resources = await resourcesCollection.find({}, { session }).toArray()
        }, transactionOptions)
        if (transactionResult) {
          return resources ? resources : null
        } else {
          await session.abortTransaction()
          return null
        }

      } catch (e) {
        console.log("hata");
        //session.abortTransaction() otomatik abort ediyor
        throw GraphQLError("bir hata oluştu")
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
            await session.abortTransaction()
            console.error("hata")
            return null;
          }
          resourcesId = await resourcesCollection.insertOne({
            resources: input?.resources,
            counter: 0
          }, { session })

        }, transactionOptions)

        if (transactionResult) {
          const resources = await resourcesCollection.findOne({ _id: resourcesId?.insertedId }, { session })
          return resources ? resources : null
        } else {
          await session.abortTransaction()
          return null
        }

      } catch (e) {
        console.log("hata: " + e);
        //session.abortTransaction() otomatik abort ediyor
        throw GraphQLError("bir hata oluştu")
      } finally {
        await session.endSession()
      }
    },
    updateResources: async (_, { input }, { req, res, client }) => {
      const resourcesCollection = await client.db("counter").collection("resources")
      const session = await client.startSession()
      let resources;

      try {
        const transactionResult = await session.withTransaction(async () => {
          resources = await resourcesCollection.findOneAndUpdate({ resources: input?.resources }, {
            $inc: { counter: 1 }
          }, { session })

        }, transactionOptions)

        if (transactionResult) {
          return resources ? resources.value : null
        } else {
          console.log("transaction aborted");
          session.abortTransaction()
          return null
        }
      } catch (e) {
        //hata fırlatımı
        console.log("hata: " + e);
      } finally {
        await session.endSession()
      }
    },
    deleteResources: async (_, { input }, { req, res, client}) => {
      const resourcesCollection = client.db("counter").collection("resources")
      const session = client.startSession()
      let resources;

      try{
        const transactionResult = await session.withTransaction(async()=>{
          resources = await resourcesCollection.findOneAndDelete({resources: input?.resources},{ session })
        }, transactionOptions)
        if(transactionResult){
          return resources ? resources.value : null
        }else{
          await session.abortTransaction()
          return null
        }
      }catch(e){
        console.log("hata: " + e)
      }finally{
        await session.endSession()
      }
    }
  }
}