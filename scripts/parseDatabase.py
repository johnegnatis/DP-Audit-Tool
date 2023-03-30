import pdfplumber
import json
#from scripts.objects import Class, Student, StudentEncoder
import re
import pandas as pd
from collections import namedtuple


def parseDatabaseMethod():

    # extracting txt file
    with open(r'scripts/database.txt', 'r') as file:
        data = file.read()
    
    data_list = data.split('\n')
    typeOptions = "core"
    master_list = []
    masterDict = {}
    track_name = ""

    for i in range(12, len(data_list)):
        if data_list[i] == "Prerequisites":
            track_name = "prerequisites"
            typeOptions = "prerequisites"
            continue
        if data_list[i] == "cores_CyberSecurity":
            masterDict.update({track_name : master_list})
            track_name = "cybersecurity"
            master_list = []
            typeOptions = "core"
            continue
        if data_list[i] == "cores_DataScience":
            masterDict.update({track_name : master_list})
            master_list = []
            typeOptions = "core"            
            track_name = "data_science"
            continue
        if data_list[i] == "cores_IntelligentSystems":
            masterDict.update({track_name : master_list})
            track_name = "intelligent_systems"
            master_list = []
            typeOptions = "core"
            continue
        if data_list[i] == "cores_InteractiveComputing":
            masterDict.update({track_name : master_list})
            track_name = "interactive_computing"
            master_list = []
            typeOptions = "core"
            continue
        if data_list[i] == "cores_NetworksandTelecommunications":
            masterDict.update({track_name : master_list})
            track_name = "networks_and_telecommunications"
            master_list = []
            typeOptions = "core"
            continue
        if data_list[i] == "cores_Systems":
            masterDict.update({track_name : master_list})
            track_name = "systems"
            master_list = []
            typeOptions = "core"
            continue
        if data_list[i] == "cores_TraditionalComputerScience":
            masterDict.update({track_name : master_list})
            track_name = "traditional_computer_science"
            master_list = []
            typeOptions = "core"
            continue
        if data_list[i] == "cores_SoftwareEngineering":
            masterDict.update({track_name : master_list})
            track_name = "software_engineering"
            master_list = []
            typeOptions = "core"
            continue
        
        if data_list[i] == "One of the following courses":
            typeOptions = "one_of_the_following"
            continue
        if data_list[i] == "Two of the following courses":
            typeOptions = "two_of_the_following"
            continue
        if data_list[i] == "Three of the following courses":
            typeOptions = "three_of_the_following"
            continue

        if data_list[i] != "":
            d = {
                "course_name": data_list[i],
                "typeOptions": typeOptions
            }
            master_list.append(d)
    masterDict.update({track_name : master_list})

    jsonStr = json.dumps(masterDict, indent = 4)
    print(jsonStr)
    with open("database.json", "w") as outfile:
        outfile.write(jsonStr)
        
if __name__ == '__main__':
    parseDatabaseMethod()