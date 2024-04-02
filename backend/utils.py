import os

FILENOTFOUND = "File not fond"

FILEMAPPING = {
    "Resume": "Resume_",
    "PS": "PS_",
    "LOR1": "LOR1_",
    "LOR2": "LOR2_",
    "Transcripts": "Transcript_",
}

def get_filename(fileType, applicantId):
    filePath = os.path.join(os.getcwd(),"PDF")
    fileList = os.listdir(filePath)
    for fileName in fileList:
        pattern = FILEMAPPING[fileType] + str(applicantId) + '.pdf'
        if pattern == fileName:
            return (filePath, fileName)
    return FILENOTFOUND

def get_test_filename():
    filePath = os.path.join(os.getcwd(),"PDF")

    return (filePath, "test.pdf") # for tutorial