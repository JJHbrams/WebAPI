#-*- coding: utf-8 -*-
#python3
import json
import requests
import time
from requests.api import head

class ReqData:
    # Private Info
    __URL = "https://192.168.92.106/auth"
    __ID  = "admin"
    __PW  = "digital2121"
    
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
        self.sess.post(ReqData.__URL, json=paylaod, headers=header, verify=False)


    # Get data
    def GetDDCdata(self, _URL):
        data = self.sess.post(_URL, json=None, verify=False)
        # Get .json data
        return data.json()
    
    # Set ontrol input
    def SetDDCctrl(self, _URL):
        # Example control signal
        control  = {"params" : {"value_list":[{"id":542,"by_who":1,"point_value":"ON"}]}}
        data=self.sess.post(_URL, json=control, verify=False)
        return data

    # Get desired key-value 
    @staticmethod
    def GetKeyVal(Data, Field):
        # Ex) extract 'name'
        out_=[]
        for i in range (len(Data)):
            attr = Data[i]['cp_attr_list']
            for j in range(len(attr)):
                if attr[j]['attr_code'] == Field:
                    out_.append(attr[j]['lp_value']) 
                    break
        return out_



if __name__ == '__main__':
    # Target data URL 
    _cpointURL = 'https://192.168.92.106/api/wapi/pm/get_cpoint_all' 
    _svalURL = 'https://192.168.92.106/api/wapi/ps/set_values'
    # Make request sesion object
    ACP5_sess = ReqData()
    # Get CP data
    cData_BF = ACP5_sess.GetDDCdata(_cpointURL)['cp_list']
    # Write CP data as .json (some issue on relative path (I used VScode), need to be corrected)
    with open("./source/LG/ACP5/data/cpoint_list.json", 'w') as jfile:
        json.dump(cData_BF, jfile, sort_keys=True, indent=4)

    #Set value
    ACP5_sess.SetDDCctrl(_svalURL)
    cData_AF = ACP5_sess.GetDDCdata(_cpointURL)['cp_list']
    # # "Get field info" test
    # FIELD = 'name'
    # keyVal = ACP5_sess.GetKeyVal(cpointData, FIELD)
    # print(FIELD + ' : ', keyVal)

    print(cData_AF)
    