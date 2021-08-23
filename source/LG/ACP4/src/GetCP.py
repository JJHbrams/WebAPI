#-*- coding: utf-8 -*-
#python3
import json
import elasticsearch
import requests
import socket
import time

from requests.api import head
from elasticsearch import Elasticsearch
from ssl import create_default_context

class ReqData:
    # Private Info
    __URL = "https://192.168.92.107:80"
    __ID  = "admin"
    __PW  = "digital21"
    
    # Start python request session
    def __init__(self):
        # Define a session
        self.sess = requests.Session()
        # self.sess.get(ReqData.__URL, verify=False)
        # LogIn request payload (data)
        paylaod = {
                "provider"  : "password",
                "username"  : ReqData.__ID,
                "password"  : ReqData.__PW,
                "guid"      : "5c6875d8-806c-d4ca-59cb-ddb1cbbca070",
                "key"       : "5c6875d8-806c-d4ca-59cb-ddb1cbbca070"
                }
        # LogIn request header
        header = {
                "Referer"   : "https://192.168.92.106/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36"
                }
        self.sess.post(ReqData.__URL, data=paylaod, headers=header, verify=False)


    # Get data
    def GetDDCdata(self, _URL):
        data = self.sess.post(_URL, data=None, verify=False)
        # Get .json data
        return data.json()
    


if __name__ == '__main__':
    # # Target data URL 
    # _cpointURL = 'https://192.168.92.106/api/wapi/pm/get_cpoint_all' 
    # _svalURL = 'https://192.168.92.106/api/wapi/ps/set_values'
    # # Make request sesion object
    # ACP5_sess = ReqData()
    # # Get CP data
    # cData = ACP5_sess.GetDDCdata(_cpointURL)['cp_list']
    # # Write CP data as .json (some issue on relative path (I used VScode), need to be corrected)
    # with open("./source/LG/data/cpoint_list.json", 'w') as jfile:
    #     json.dump(cData, jfile, sort_keys=True, indent=4)

    # print(cData)
    





    # ********* DEBUG & TEST ********
    HOST = '192.168.92.107'
    PORT = 9300
    with socket.socket(socket.AF_INET,socket.SOCK_STREAM) as sock_serv: 
        # Try sever connection
        try:
            sock_serv.connect((HOST, PORT))
        except:
            print("Socket Connection Error!!!")

        print("Socket connected!!!")
        while True:
            # Try data communication with sever
            try:
                # sock_serv.sendall()
                data = sock_serv.recv(10000)
                print("Socket Communication!!!")
                print(data)

            except:
                print("Socket Comm Error!!!")
                sock_serv.close()
            time.sleep(1)

        # print(data)
        sock_serv.close()





