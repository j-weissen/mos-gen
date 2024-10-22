/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cnyhpmdosk04e5k")

  collection.createRule = "@request.auth.role = \"editor\""
  collection.updateRule = "@request.auth.role = \"editor\""
  collection.deleteRule = "@request.auth.role = \"editor\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cnyhpmdosk04e5k")

  collection.createRule = "@request.auth.username = \"isolde\""
  collection.updateRule = "@request.auth.username = \"isolde\""
  collection.deleteRule = "@request.auth.username = \"isolde\""

  return dao.saveCollection(collection)
})
