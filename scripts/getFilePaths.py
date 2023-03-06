from tkinter import filedialog
from tkinter import *

def getFilePathsMethod():
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)
    file_paths = filedialog.askopenfilename(filetypes=(("PDF Files", "*.pdf"),("All Files", "*.*")), title="Select Transcript(s)", multiple=True)
    return file_paths