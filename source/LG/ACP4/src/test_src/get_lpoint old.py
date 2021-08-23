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

class myWebDriver:
    def __init__(self):
        self.__URL = 'https://192.168.92.106/#/master/dashboard'

        self.options = webdriver.ChromeOptions()
        # skip ssl
        self.options.add_argument("--ignore-certificate-errors")
        self.driver = webdriver.Chrome(chrome_options=self.options)

    def LoadPage(self):
        # Load URL
        self.driver.get(self.__URL)
        self.driver.implicitly_wait(3)
        # Login
        try:
            self.driver.find_element_by_xpath("/html/body/div/section/main/form/group[1]/input").send_keys("admin")
            self.driver.find_element_by_xpath("/html/body/div/section/main/form/group[2]/input").send_keys("digital2121")
            self.driver.find_element_by_xpath("/html/body/div/section/main/form/input").click()

        except:
            return

    def GetElement(self, Xpath):
        element = self.driver.find_element_by_xpath(Xpath)
        return element

    def Loading(self, Xpath, delay=20):
        WebDriverWait(self.driver, delay).until(EC.presence_of_element_located((By.XPATH, Xpath)))

    def shutdown(self):
        self.driver.quit()

        
if __name__ == '__main__':
    # Gen selenum driver
    ACP5 = myWebDriver()
    # Load first main page
    ACP5.LoadPage()
    ACP5.Loading("/html/body/div/main/content/inventory/deck[1]/item/article")

    myCookie = ACP5.driver.get_cookies()    
    # for cookie in myCookie: 
    #     print(cookie)
    #     # ACP5.driver.add_cookie(cookie)

    # ACP5.driver.get(dataURL)
    # # response = requests.post(dataURL, headers=headers)

    # Load lpoint_all_small 
    # sess = requests.Session()
    # # headers = {'Content-Type' : 'application/json', 'X-Requested-With': 'XMLHttpRequest'}
    # dataURL = 'https://192.168.92.106/api/wapi/get_lpoint_all_small'  
    # # for cookie in myCookie:    
    # #     sess.cookies.set(cookie['name'], cookie['value'])
        
    # # response = sess.get(dataURL, headers=headers, verify=False).json()
    # response = sess.post(dataURL, verify=False)
    # print(response.text)

    Data = ACP5.driver.execute_script( open("./ReadData.js").read() )
    print(Data)

    ACP5.driver.implicitly_wait(3)

    
    # ACP5.driver.implicitly_wait(3)
    
    # ACP5.shutdown()




