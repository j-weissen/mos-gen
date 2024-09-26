/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "w86fdtdbaxg908q",
    "created": "2024-08-15 11:30:39.580Z",
    "updated": "2024-08-15 11:30:39.580Z",
    "name": "categories",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vj37bap2",
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
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.username = \"isolde\"",
    "updateRule": "@request.auth.username = \"isolde\"",
    "deleteRule": "@request.auth.username = \"isolde\"",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("w86fdtdbaxg908q");

  return dao.deleteCollection(collection);
})
