/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("egules1xemksaek")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.username = \"isolde\""
  collection.updateRule = "@request.auth.username = \"isolde\""
  collection.deleteRule = "@request.auth.username = \"isolde\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("egules1xemksaek")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
