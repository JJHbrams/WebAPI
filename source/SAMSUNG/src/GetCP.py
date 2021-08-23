#-*- coding: utf-8 -*-
#python3
import json
import requests
import time
from requests import cookies
from requests.api import head

'''
    1. When using another DDC, plz change the ReqData's 
        __URL
        __ID
        __PW
        payload
        header
    for your target.

    2. Also please check the URL which gives the slave devices' data.
        ex) data = sess.post('https://192.168.92.105/dms2/dataCommunication', data=None, verify=False)
'''
class ReqData:
    # Private Info
    __URL = 'https://192.168.92.105/dms2/Login.jsp'
    __ID = "admin"
    __PW = "auto1234"
    
    # Start python request session
    def __init__(self):
        self.sess = requests.Session()
        cookiejar = self.sess.get(ReqData.__URL, verify=False).cookies
        for item in cookiejar: cookie=item.value
        # LogIn request header & payload (data)
        header = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",
                }
        paylaod = {
                "securedPassword": ReqData.__ID+cookie,
                "securedUsername": ReqData.__PW+cookie
                }
        self.sess.post(ReqData.__URL, data=paylaod, headers=header, verify=False)


    # Get data
    def GetDDCdata(self, _URL):
        data = self.sess.post(_URL, data=None, verify=False)
        # Get .json data
        return data.text

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
    _dmsURL = 'https://192.168.92.105/dms2/dataCommunication' 
    # Request sesion
    ACP5_sess = ReqData()
    # Get CP data
    dmsData = ACP5_sess.GetDDCdata(_dmsURL)
    
    print(dmsData)





    # # ********* DEBUG & TEST ********
    # with requests.Session() as sess:
    #     # get current session's cookie for login
    #     cookiejar = sess.get('https://192.168.92.105/dms2/Login.jsp', verify=False).cookies
    #     for item in cookiejar: coockie=item.value
    #     # LogIn request header & payload (data)
    #     header = {
    #             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",
    #             }
    #     paylaod = {
    #             "securedPassword": "auto1234"+coockie,
    #             "securedUsername": "admin"+coockie
    #             }
    #     # Call login page & post login info
    #     res=sess.post('https://192.168.92.105/dms2/Login.jsp', data=paylaod, headers=header, verify=False, allow_redirects=False)
    #     # print(res.text)

    #     # Get data from "dataCommunication"
    #     # Currently there's notihng connected to the controller, it gives Error (Don't know exect form of the data)
    #     data = sess.post('https://192.168.92.105/dms2/dataCommunication', data=None, verify=False)
    #     # print(data.text)

    #     with open("./SAMSUNG/data/data.json", 'w') as jfile:
    #         json.dump(data, jfile, sort_keys=True, indent=4)  

    #     print(data)

        
    