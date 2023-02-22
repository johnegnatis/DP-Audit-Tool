import pdfplumber
from tkinter import filedialog
from tkinter import *
import json
from scripts.objects import * # must be absolute path

def getDataFromTranscriptMethod():


    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)
    file_path = filedialog.askopenfilename(filetypes=(("PDF Files", "*.pdf"),("All Files", "*.*")))

    classes = []
    for x in range(4):
        myClass = Class('core', 'cs1000', 'fall 2020', '4.0')
        classes.append(myClass)

    studentObj = Student('John', 44, True, False, '1/1/2020', '1/1/2023', classes)
    return studentObj.packStudentObject()

    try:
        data = ''
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                current_page = page
                kwargs = { 
                    'keep_blank_chars': True,
                    'use_text_flow': False,
                    'horizontal_ltr': True,
                    'vertical_ttb': True,
                    'extra_attrs': [],
                    'split_at_punctuation': False
                    }
                data += current_page.extract_text(x_tolerance=3, y_tolerance=3, layout=False, x_density=7.25, y_density=13, **kwargs) + '\n'
        return data

    except:
        raise Exception("This file cannot be read. Ensure that it is a PDF file and please try again.")