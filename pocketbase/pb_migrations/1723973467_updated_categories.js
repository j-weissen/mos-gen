/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w86fdtdbaxg908q")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cjnxkznn",
    "name": "measures",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "cnyhpmdosk04e5k",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w86fdtdbaxg908q")

  // remove
  collection.schema.removeField("cjnxkznn")

  return dao.saveCollection(collection)
})