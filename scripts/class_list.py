from tinydb import TinyDB, Query
db = TinyDB('classes.json')

Classes = Query()

def get_class_db():
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

def get_class_list():
    db = get_class_db()
    return db.all()

# If you run insert_classes 2 consecutive times, the second write overrides the first one
def insert_class(class_obj):
    db = get_class_db()

    # Convert number to uppercase
    class_obj['number'] = class_obj['number'].upper()
    
    # Check to see if the class exists
    results = db.search(Classes.number == class_obj['number'])
    if len(results) > 0:
        db.update(class_obj, Classes.number == class_obj['number'])
    else: # If class does not exits, insert it
        db.insert(class_obj)

def delete_class(number):
    db = get_class_db()
    db.remove(Classes.number == number)
    
def update_class(oldNumber, class_obj):
    db = get_class_db()
    db.update(class_obj, Classes.number == oldNumber)

# Requests = 'get', 'insert', 'delete', 'update'
def handle_class_request(req, payload):
    try:
        if req=='get':
            return get_class_list()
        elif req=='insert':
            insert_class(payload['classObj'])
        elif req=='delete':
            delete_class(payload['number'])
        elif req=='update':
            update_class(payload['number'], payload['classObj'])
        else:
            raise Exception
    except:
        raise Exception("Error: Bad Class Request")