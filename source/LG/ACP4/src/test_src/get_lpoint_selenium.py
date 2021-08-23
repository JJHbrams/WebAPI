#-*- coding: utf-8 -*-
#python3
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




        
if __name__ == '__main__':
    # Gen selenum webdriver object
    ACP5 = pySWD()
    # Load first main page
    main_page = "/html/body/div/main/content/inventory/deck[1]/item/article"
    ACP5.EnterTheSite()
    ACP5.Loading(main_page)

    cbfunc = open("./ReadData.js").read()
    # print(cbfunc)
    tmp=ACP5.driver.execute_script( cbfunc ) # lpoint 주기적 호출
    # tmp=ACP5.driver.execute_script( "return " + cbfunc +"()" )
    # tmp=ACP5.driver.execute_script( "return " + "function callbackLP(){var xhr = new XMLHttpRequest();  xhr.open('POST', 'https://192.168.92.106/api/wapi/get_lpoint_all_small', true); xhr.onload = function(){console.log(xhr.response);};    xhr.send(); return xhr.responseText;}" +"()" )
    # print(tmp)
    # POST_lpoint_data = ACP5.driver.execute_script( open("./ReadData.js").read() )
    # print(POST_lpoint_data)
    ACP5.driver.implicitly_wait(3)
    
    # ACP5.shutdown()




