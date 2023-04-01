import csv
import json
import hashlib


def myhash(datastr):
    h = hashlib.sha1(str(datastr).encode('utf-8')).digest()
    ret = ""
    for i in range(0,8):
        x = h[i]%26;
        ret += chr(ord('a') + x)
    return ret


# with open('restaurant-menus.csv') as csv_file:
#     csv_reader = csv.reader(csv_file, delimiter = ',')
#     for row in csv_reader:
#         try:
#             if(int(row[0])>=34245 and int(row[0])<=34515):
#                 print(','.join(row))
#         except:
#             pass
#
with open('_restaurant_menus__202303300010.csv', encoding="mbcs") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter = ',')
    for row in csv_reader:
#        try:
        data = []
        for i in range(0, len(row)):
            item=str(row[i]).strip()
            data.append(item)
            data.append(myhash(item))
        print(','.join(data))
#        except:
        continue






# import os
# import pandas as pd
# import uuid
 
 
# class FileSettings(object):
#     def __init__(self, file_name, row_size=100):
#         self.file_name = file_name
#         self.row_size = row_size
 
 
# class FileSplitter(object):
 
#     def __init__(self, file_settings):
#         self.file_settings = file_settings
 
#         if type(self.file_settings).__name__ != "FileSettings":
#             raise Exception("Please pass correct instance ")
 
#         self.df = pd.read_csv(self.file_settings.file_name,
#                               chunksize=self.file_settings.row_size)
 
#     def run(self, directory="temp"):
 
#         try:os.makedirs(directory)
#         except Exception as e:pass
 
#         counter = 0
 
#         while True:
#             try:
#                 file_name = "{}/{}_{}_row_{}_{}.csv".format(
#                     directory,  self.file_settings.file_name.split(".")[0], counter, self.file_settings.row_size, uuid.uuid4().__str__()
#                 )
#                 df = next(self.df).to_csv(file_name)
#                 counter = counter + 1
#             except StopIteration:
#                 break
#             except Exception as e:
#                 print("Error:",e)
#                 break
 
#         return True
 
 
# def main():
#     helper =  FileSplitter(FileSettings(
#         file_name='restaurant-menus.csv',
#         row_size=100000
#     ))
#     helper.run()
 
# main()