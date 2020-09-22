from sys import argv
from pdfminer.pdfparser import PDFParser
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfpage import PDFPage, PDFTextExtractionNotAllowed
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import PDFPageAggregator
from pdfminer.layout import LAParams
from io import StringIO


class PDFUtils():
    def __init__(self):
        pass

    def convert_path(self, path):
        return path.replace('\\', '/')

    def pdf2text(self, path):
        output = StringIO()
        convert_path = self.convert_path(path)
        # print(convert_path)

        with open(convert_path, 'r', errors='ignore') as f:
            parser = PDFParser(f)

            doc = PDFDocument(parser)

            if not doc.is_extractable:
                raise PDFTextExtractionNotAllowed

            pdfrm = PDFResourceManager()

            laparams = LAParams()

            device = PDFPageAggregator(pdfrm, laparams=laparams)

            interpreter = PDFPageInterpreter(pdfrm, device)

            for page in PDFPage.create_pages(doc):
                interpreter.process_page(page)
                layout = device.get_result()
                for x in layout:
                    if hasattr(x, "get_text"):
                        content = x.get_text()
                        # print(content)
                        output.write(content)

        content = output.getvalue()
        print(content)
        output.close()
        return content


if __name__ == '__main__':
    path = argv[1]
    #path = r'C:\Users\Lenovo、\Desktop\前端\npm.pdf'
    pdfUtils = PDFUtils()
    pdfUtils.pdf2text(path)
