import pdfplumber

def getDataFromTranscriptMethod(pdfData):
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
    # TODO: Extract Student Object from data, and return a JSON string
    return data