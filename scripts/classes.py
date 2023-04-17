from tinydb import TinyDB, Query
import json
db = TinyDB('classes.json')

Classes = Query()

def store_classes():
    try:
        data_prod = './build/databases/classes.json'
        data_dev = './public/databases/classes.json'
        test_dev = '../public/databases/classes.json'

        try:
            db = TinyDB(data_prod)
        except:
            try:
                db = TinyDB(data_dev)
            except:
                db = TinyDB(test_dev)
        return db
    except:
        raise Exception("Error: Error storing classes.json file.")


def get_list():
    db = store_classes()
    return db.all()

def insert_classes(classes=[]):
    db = store_classes()
    # db.contains(Classes.number == '')
    results = db.search(Classes.number == 'CS 3333')
    for res in results:
        if res['name'] != None:
            res['name']  = name
        db.write_back(res)
        print(res.upper())
        print(res['number'])
    for res in results:
        print(res) 
    db = store_classes()
    db.truncate()    
    for name in classes:
        db.insert(name)
    # db.insert({'name': 'Probability and Statistics', 'number':'CS 3333'})


def delete_record():
    db = store_classes()
    db.remove(Classes.number == '')
    # db.purge() # remove all

    
def update_user():
    db = store_classes()
    db.update({'name': '', 'number': ''})
    for update in db:
        print(update)
