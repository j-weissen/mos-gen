/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "egules1xemksaek",
    "created": "2024-10-17 20:27:59.979Z",
    "updated": "2024-10-17 20:27:59.979Z",
    "name": "subcategories",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "1mc3tsq8",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "9yuo5jqg",
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
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("egules1xemksaek");

  return dao.deleteCollection(collection);
})
