# coding: utf-8
import eel
import sys
import pdfplumber

@eel.expose
def getPDFData(pdfData):
    data = ''
    with pdfplumber.open(pdfData) as pdf:
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


if __name__ == '__main__':
    if sys.argv[1] == '--develop':
        eel.init('client')
        eel.start({"port": 3000}, host="localhost", port=8888)
    else:
        eel.init('build')
        eel.start('index.html')
