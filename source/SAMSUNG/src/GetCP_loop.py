#-*- coding: utf-8 -*-
#python3
import json
import requests
import time
from requests.api import head

class ReqData:
    # Private Info
    __URL = 'https://192.168.92.106/auth'
    __ID = "admin"
    __PW = "digital2121"
    
    # Start python request session
    def __init__(self):
        self.sess = requests.Session()
        # self.sess.get(ReqData.__URL, verify=False)
        data = {
                "provider"  : "password",
                "username"  : ReqData.__ID,
                "password"  : ReqData.__PW,
                "guid"      : "5c6875d8-806c-d4ca-59cb-ddb1cbbca070",
                "key"       : "5c6875d8-806c-d4ca-59cb-ddb1cbbca070"
                }

        header = {
                "Referer"   : "https://192.168.92.106/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36"
                }
        self.sess.post(ReqData.__URL, data=data, headers=header, verify=False)


    # Get data
    def GetDDCdata(self, _URL):
        data = self.sess.post(_URL, data=None, verify=False)
        return data.json()

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
    # Data URL
    # _lpointURL = 'https://192.168.92.106/api/wapi/get_lpoint_all_small'  
    _cpointURL = 'https://192.168.92.106/api/wapi/pm/get_cpoint_all' 

    ACP5_sess = ReqData()

    interval = 0.5 # 500ms
    while(1):
        # lpoint = ACP5_sess.GetDDCdata(_lpointURL)
        cpoint = ACP5_sess.GetDDCdata(_cpointURL)

        # lpointData = json.loads(lpoint['data'])['lp_list']
        cpointData = cpoint['cp_list']

        with open("cpoint_list.json", 'w') as jfile:
            json.dump(cpointData, jfile, sort_keys=True, indent=4)

        FIELD = 'ahu_settemp'
        keyVal = ACP5_sess.GetKeyVal(cpointData, FIELD)
        print(keyVal)

        time.sleep(interval)

    # print(lpoint)
    print(cpoint)
    








    # ********* DEBUG & TEST ********
    # with requests.Session() as sess:
    #     sess.get('https://192.168.92.106/#/master/dashboard', verify=False)
    #     sess.post('https://192.168.92.106/auth', data=data, headers=header , verify=False, allow_redirects=False)

    #     cp_list = sess.post('https://192.168.92.106/api/wapi/pm/get_cpoint_all', data=None, verify=False)
    #     cData = cp_list.json()['cp_list']

    #     # Ex) extract 'name'
    #     out_=[]
    #     Target_field = 'name'
    #     for i in range (len(cData)):
    #         attr = cData[i]['cp_attr_list']
    #         for j in range(len(attr)):
    #             if attr[j]['attr_code'] == Target_field:
    #                 out_.append(attr[j]['lp_value']) 
    #                 break
    #     print(out_)
    #     print(data)




