from tkinter import filedialog
from tkinter import *
import PyPDF2
import base64

def getFilePathsMethod():
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)
    file_paths = filedialog.askopenfilename(filetypes=(("PDF Files", "*.pdf"),("All Files", "*.*")), title="Select Transcript(s)", multiple=True)
    return file_paths

def getPDFMethod():
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)
    pdf = filedialog.askopenfilename(filetypes=(("PDF Files", "*.pdf"),("All Files", "*.*")), title="Select Degree Plan", multiple=False)
    return pdf