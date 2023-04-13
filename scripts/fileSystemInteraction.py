from tkinter import filedialog
from fillpdf import fillpdfs
from datetime import date
from tkinter import *
from shutil import copy2
try:
    from scripts.helpers import get_server_path
    from scripts.settings import get_setting
except:
    from helpers import get_server_path
    from settings import get_setting 

def getFilePathsMethod():
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)
    default_path = get_setting("default-path-for-transcript")
    file_paths = filedialog.askopenfilename(filetypes=(("PDF Files", "*.pdf"),("All Files", "*.*")), title="Select Transcript(s)", multiple=True, initialdir=default_path)
    if not file_paths:
        raise Exception("Warning: No files were selected.")
    return file_paths

def savePDFMethod(file_name, signature, flatten):
    try:
        root = Tk()
        root.withdraw()
        root.wm_attributes('-topmost', 1)


        default_path = get_setting("default-path-for-degree-plan")
        # destination
        dir_to_save = getDirectory("Save Degree Plan", default_path)

        # source
        file_path = get_server_path() + '/' + file_name

        if signature or flatten == 1:
            giveSignature(file_path, dir_to_save + '/' + file_name, signature, flatten)
        else:
            copy2(file_path, dir_to_save, follow_symlinks=True)

        return dir_to_save
    except:
        raise Exception("Error: Error while saving PDF.")

def getDirectory(message="Select directory", default_path = None):
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)

    # destination
    dir_to_save = filedialog.askdirectory(title=message, initialdir=default_path)
    if not dir_to_save:
        raise Exception("Warning: No directory was selected.")
    return dir_to_save

def giveSignature(file_path, dir_to_save, signature, flatten):
    signature_dict = {
        "Academic Advisor": signature,
        "Date Submitted": date.today(),
    }
    fillpdfs.write_fillable_pdf(file_path, dir_to_save, signature_dict, flatten=flatten)

