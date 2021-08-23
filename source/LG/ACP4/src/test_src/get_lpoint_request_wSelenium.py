#-*- coding: utf-8 -*-
#python3
import schedule
import time
import json
import requests
from requests.api import request

import selenium
from selenium import webdriver
from selenium.webdriver import ActionChains

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait



# Custom Python Selenium Webdriver class
class pySWD:
    # Private Info
    __URL = 'https://192.168.92.106/#/master/dashboard'
    __ID = "admin"
    __PW = "digital2121"

    def __init__(self):
        # skip ssl
        self.options = webdriver.ChromeOptions()
        self.options.add_argument("--ignore-certificate-errors")
        self.driver = webdriver.Chrome(options=self.options)

    def EnterTheSite(self):
        # Load URL
        self.driver.get(pySWD.__URL)
        self.driver.implicitly_wait(3)
        # Login
        try:
            LogInID = "/html/body/div/section/main/form/group[1]/input"
            LogInPW = "/html/body/div/section/main/form/group[2]/input"
            LogInBtn = "/html/body/div/section/main/form/input"
            self.GetElement(LogInID).send_keys(pySWD.__ID)
            self.GetElement(LogInPW).send_keys(pySWD.__PW)
            self.GetElement(LogInBtn).click()

        except:
            # Not a login session
            return

    # Get elements from given Xpath
    def GetElement(self, Xpath):
        element = self.driver.find_element_by_xpath(Xpath)
        return element

    # Wait for webpage loading : wait until given Xpath's element is loaded.
    def Loading(self, Xpath, delay=20):
        WebDriverWait(self.driver, delay).until(EC.presence_of_element_located((By.XPATH, Xpath)))

    # Quit webdriver
    def shutdown(self):
        self.driver.quit()

class ReqData:
    # Data URL
    
    # Start python request session
    def __init__(self, cookie):
        self.sess = requests.Session()
        # Get login session cookie from selnium
        for cookie in LoginCookie:    
            self.sess.cookies.set(cookie['name'], cookie['value'])

    # Get data
    def GetDDCdata(self):
        _lpointURL = 'https://192.168.92.106/api/wapi/get_lpoint_all_small'  
        _cpointURL = 'https://192.168.92.106/api/wapi/pm/get_cpoint_all' 
        # Get lpoint data all small
        lpoint = self.sess.post(_lpointURL, data=None, verify=False).json()
        lpointData = json.loads(lpoint['data'])['lp_list']
        # Get cpoint data all
        cpoint = self.sess.post(_cpointURL, data=None, verify=False).json()
        cpointData = cpoint['cp_list']
        return lpointData, cpointData

        
if __name__ == '__main__':
    # Gen selenum webdriver object
    ACP5 = pySWD()
    # Load first main page
    main_page = "/html/body/div/main/content/inventory/deck[1]/item/article"
    ACP5.EnterTheSite()
    ACP5.Loading(main_page)
    LoginCookie = ACP5.driver.get_cookies()

    # Request data session
    ACP5_sess = ReqData(LoginCookie)

    # Single execution
    [lpData, cpData] = ACP5_sess.GetDDCdata() 

    print(len(lpData))
    print(len(cpData))

    # # Iterative execution
    # schedule.every(0.5).seconds.do(ACP5_sess.GetDDCdata)
    # while True:
    #     schedule.run_pending()
    #     time.sleep(0.01)

    
    '''
    cpoint 가 기기별 정보를 나타냄
    lpoint 는 주기적으로 업데이트되나 cpoint와 연결성 찾기가 난해
    혹은 cpoint도 주기적으로 업데이트되어야 하나 기기가 없어서 안되는 것일 수도 있음, 실제로 angularjs & hrml에서 접근하는 변수는 cp_attr 아래 lp_value값들임
    아마도 스크립트에서 get_lpoint_all_small을 호출해서 cpoint의 lp_value에 덮어씌우고 이를 사용하는 것으로 추정됨.

    결론: get_lpoint_all_small을 임의로 더 빠르게 호출하고 주기적으로 get_cpoint_all 을 호출해서 변화되는 값을 측정 
    '''


    # # Iterative call with selenium
    # cbfunc = open("./ReadData.js").read()
    # tmp=ACP5.driver.execute_script( cbfunc ) # lpoint 주기적 호출

    # print(lpoint)
    # print(cpoint)


    ACP5.shutdown()




