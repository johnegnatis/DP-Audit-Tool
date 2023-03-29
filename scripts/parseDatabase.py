import pdfplumber
import json
#from scripts.objects import Class, Student, StudentEncoder
import re
import pandas as pd
from collections import namedtuple


def parseDatabaseMethod():
    text = ''
    list = namedtuple('data', 'track')

    # extracting txt file
    with open(r'scripts/database.txt', 'r') as file:
        data = file.read()
    

    data_list = data.split('\n')
    computer_science_tracks = []
    software_engineering_tracks = ['Software Engineering']
    prereqs = []

    typeOptions = "core"
    list = []
    class_list = []
    dataScience = []

    master_list = []
    masterDict = {}
    track_name = ""
               

    # LIST OF TRACKS
    for i in range(1,8):
        track = data_list[i]
        computer_science_tracks.append(track)
    
    dictionary = {}
    # LIST OF PREREQS
    for i in range(13,22):
        dictionary = {
            "course_name": data_list[i],
            "typeOptions": "prerequisites"
        }
        prereqs.append(dictionary)
    masterDict = {"prerequisites":prereqs}
    dictionary = {}
    typeOptions = "core"

    # CORES FOR CYBERSECURITY
    for i in range(24,32):
        dictionary = {
            "course_name": data_list[i],
            "typeOptions": typeOptions
        }
        # ONE OF THE FOLLOWING
        if data_list[i] == "Two of the following courses":
            typeOptions = "two_of_the_following"
            continue
        class_list.append(dictionary)

    masterDict.update({"cybersecurity" : class_list})
    typeOptions = "core"
    dictionary = {}
    class_list = []

    # CORES FOR DATASCIENCE
    dictionary = {}
    for i in range(34,44):
        dictionary = {
            "course_name": data_list[i],
            "typeOptions": typeOptions
        }
        # ONE OF THE FOLLOWING
        if data_list[i] == "One of the following courses":
            typeOptions = "one_of_the_following"
            continue
        class_list.append(dictionary)

    masterDict.update({"data_science" : class_list})
    typeOptions = "core"
    dictionary = {}
    class_list = []

    # CORES FOR INTELLIGENT SYSTEMS
    for i in range(46,53):
        dictionary = {
            "course_name": data_list[i],
            "typeOptions": typeOptions
        }
        # ONE OF THE FOLLOWING
        if data_list[i] == "One of the following courses":
            typeOptions = "one_of_the_following"
            continue
        class_list.append(dictionary)

    masterDict.update({"intelligent_systems" : class_list})
    typeOptions = "core"
    dictionary = {}
    class_list = []

    # CORES FOR INTERACTIVE COMPUTING
    for i in range(55,64):
        dictionary = {
            "course_name": data_list[i],
            "typeOptions": typeOptions
        }
        # ONE OF THE FOLLOWING
        if data_list[i] == "Three of the following courses":
            typeOptions = "three_of_the_following"
            continue
        class_list.append(dictionary)
    masterDict.update({"interactive_computing" : class_list})
    typeOptions = "core"
    dictionary = {}
    class_list = []

    # CORES FOR NETWORKS
    for i in range(66,71):
        dictionary = {
            "course_name": data_list[i],
            "typeOptions": typeOptions
        }
        class_list.append(dictionary)

    typeOptions = "core"
    dictionary = {}
    class_list = []

    # CORES FOR SYSTEMS
    for i in range(73,82):
        dictionary = {
            "course_name": data_list[i],
            "typeOptions": typeOptions
        }
        # ONE OF THE FOLLOWING
        if data_list[i] == "One of the following courses":
            typeOptions = "one_of_the_following"
            continue
        class_list.append(dictionary)

    masterDict.update({"systems" : class_list})
    typeOptions = "core"
    dictionary = {}
    class_list = []

    # CORES FOR CS
    for i in range(84,91):
        dictionary = {
            "course_name": data_list[i],
            "typeOptions": typeOptions
        }
        # ONE OF THE FOLLOWING
        if data_list[i] == "Two of the following courses":
            typeOptions = "two_of_the_following"
            continue
        class_list.append(dictionary)
    masterDict.update({"traditional_computer_science" : class_list})
    typeOptions = "core"
    dictionary = {}
    class_list = []    

    # CORES FOR SE
    for i in range(93,98):
        dictionary = {
            "course_name": data_list[i],
            "typeOptions": typeOptions
        }

        class_list.append(dictionary)
    masterDict.update({"software_engineering" : class_list})
    typeOptions = "core"
    dictionary = {}
    class_list = []  

    jsonStr = json.dumps(masterDict, indent = 4)
    print(jsonStr)
    with open("database.json", "w") as outfile:
        outfile.write(jsonStr)

        
if __name__ == '__main__':
    parseDatabaseMethod()