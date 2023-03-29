import pdfplumber
import json
#from scripts.objects import Class, Student, StudentEncoder
import re
import pandas as pd
from collections import namedtuple

# TODO: get list of all tracks
# TODO: separate each cores to all tracks
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
    coreCyberSecurity = []
    coreDataScience = []
    coreIntelligentSystems = []
    coreInteractiveComputing = []
    coreNetworksandTelecommunications = []
    coreSystems = []
    coreTraditionalComputerScience = []
    coreSoftwareEngineering = []
    typeOptions = "core"
    list = []
    class_list = []
    dataScience = []

    masterDict = {}

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
        #if len(dictionary) == 0:
        dictionary = {
            "course_name": data_list[i],
            "typeOptions": typeOptions
        }
        # ONE OF THE FOLLOWING
        if data_list[i] == "Two of the following courses":
            typeOptions = "two_of_the_following"
            continue
        #d = {data_list[i] : typeOptions}
        class_list.append(dictionary)

    masterDict.update({"cybersecurity" : class_list})
    typeOptions = "core"
    dictionary = {}
    class_list = []

    # CORES FOR DATASCIENCE
    dictionary = {}
    for i in range(34,44):
        if len(dictionary) == 0:
            dictionary = {
                data_list[i] : typeOptions
            }
        # ONE OF THE FOLLOWING
        if data_list[i] == "One of the following courses":
            typeOptions = "one_of_the_following"
            continue
        d = {data_list[i] : typeOptions}
        class_list.append(d)

    masterDict.update({"data_science" : class_list})
    #list.append(masterDict)
    typeOptions = "core"
    dictionary = {}
    class_list = []

    # CORES FOR INTELLIGENT SYSTEMS
    for i in range(46,53):

        if len(dictionary) == 0:
            dictionary = {
                data_list[i] : typeOptions
            }

        # ONE OF THE FOLLOWING
        if data_list[i] == "One of the following courses":
            typeOptions = "one_of_the_following"
            continue

        d = {data_list[i] : typeOptions}

        #dictionary.update(d)
        class_list.append(d)
    masterDict.update({"intelligent_systems" : class_list})
    #list.append(masterDict)
    typeOptions = "core"
    dictionary = {}

    # CORES FOR INTERACTIVE COMPUTING
    for i in range(55,64):
        course = data_list[i]
        coreInteractiveComputing.append(course)
    # CORES FOR NETWORKS
    for i in range(66,71):
        course = data_list[i]
        coreNetworksandTelecommunications.append(course)
    # CORES FOR SYSTEMS
    for i in range(73,82):
        course = data_list[i]
        coreSystems.append(course)
    # CORES FOR CS
    for i in range(84,91):
        course = data_list[i]
        coreTraditionalComputerScience.append(course)    
    # CORES FOR SE
    for i in range(93,98):
        course = data_list[i]
        coreSoftwareEngineering.append(course)    

    #print(prereqs)
    #print(software_engineering_tracks)
    #for i in range(len(dataScience)):
     #   print("1:   ") 
      #  print(dataScience[i])
    jsonStr = json.dumps(masterDict, indent = 4)
    print(jsonStr)
    with open("database.json", "w") as outfile:
        outfile.write(jsonStr)

if __name__ == '__main__':
    parseDatabaseMethod()