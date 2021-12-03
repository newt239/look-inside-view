import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import glob


cred = credentials.Certificate("look-inside-view-firebase-adminsdk-kgopb-d17c630c0c.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
print("choose type: all, one")
type = input()
if type == "all":
    files = glob.glob("public/data/*")
    for fileName in files:
        print(fileName)
        if fileName != "public/data\_default.json":
            jsonData = json.load(open(fileName, 'r', encoding="utf-8_sig"))
            print(jsonData)
            db.collection('locations').document(jsonData["name"]).set({
                'name': jsonData["jpName"],
                'building': jsonData["schoolBuilding"],
                'stair': jsonData["stair"],
                'description': jsonData["description"],
                'pannellum': jsonData["pannellum"],
                'prev': jsonData["prev"],
                'next': jsonData["next"],
                'near': jsonData["near"],
                'updateAt': firestore.SERVER_TIMESTAMP
            })
else:
    print("enter location name:")
    locationName = input()
    jsonData = json.load(open("public/data/"+locationName+".json", 'r', encoding="utf-8_sig"))
    print(jsonData)
    db.collection('locations').document(jsonData["name"]).set({
        'name': jsonData["jpName"],
        'building': jsonData["schoolBuilding"],
        'stair': jsonData["stair"],
        'description': jsonData["description"],
        'pannellum': jsonData["pannellum"],
        'prev': jsonData["prev"],
        'next': jsonData["next"],
        'near': jsonData["near"],
        'updateAt': firestore.SERVER_TIMESTAMP
    })