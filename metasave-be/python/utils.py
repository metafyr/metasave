import base64

def writedata(filename,filecontent):
  if type(filecontent)==bytes:
    filecontent = base64.b64encode(filecontent) #converts byte object to base64 type object

    with open(filename,'wb') as f:   #write data to file
      f.write(filecontent)

def readdata(filename):
  with open(filename,'rb') as f:     #read data
    filecontent=f.read()

  return base64.b64decode(filecontent) #converts back to bytes