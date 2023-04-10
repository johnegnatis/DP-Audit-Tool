from tkinter import filedialog
from tkinter import *
from shutil import copy2
try:
    from scripts.helpers import get_server_path
except:
    from helpers import get_server_path

def getFilePathsMethod():
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)
    file_paths = filedialog.askopenfilename(filetypes=(("PDF Files", "*.pdf"),("All Files", "*.*")), title="Select Transcript(s)", multiple=True)
    return file_paths

def savePDFMethod(file_name):
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)

    # destination
    dir_to_save = getDirectory("Save Degree Plan")

    # source
    file_path = get_server_path() + '/' + file_name

    copy2(file_path, dir_to_save, follow_symlinks=True)

    return dir_to_save

def getDirectory(message):
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)

    # destination
    dir_to_save = filedialog.askdirectory(title=message)
    return dir_to_save