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
        self.__URL = 'https://192.168.0.13/'
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
            ID = "admin@admin.com"
            PW = "!Qadmin1212"
            self.driver.find_element_by_xpath("/html/body/main/div[1]/div[2]/input[1]").send_keys(ID)
            self.driver.find_element_by_xpath("/html/body/main/div[1]/div[2]/input[2]").send_keys(PW)
            self.driver.find_element_by_xpath("/html/body/main/div[1]/div[2]/button").click()

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
    ACP5.Loading("/html/body/main/div[2]/div[3]/canvas")

    myCookie = ACP5.driver.get_cookies()    
    sess = requests.Session() 
    for cookie in myCookie:    
        sess.cookies.set(cookie['name'], cookie['value'])
    
    data = {    ''
            }
    
    headers = { 'Host': '192.168.0.13',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-us,en;q=0.5',
                'Cache-Control': 'no-cache',
                'Connection': 'Keep-Alive',
                'Content-Length': '377',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': 'https://192.168.0.13',
                'Referer': 'https://192.168.0.13/Building%20status%20and%20analysis.html',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.39 45.0 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest'
                }

    response = sess.post('https://192.168.0.13/Building%20status%20and%20analysis.html', headers=headers, data=data, verify=False)
    print(response)

    # ACP5.Loading("/html/body/div/main/div/content/div[2]/div/group/group[2]/inventory/deck[1]/item/aside/header/b")
    # ACP5.GetElement("/html/body/div/main/div/content/div[2]/div/group/group[2]/inventory/deck[1]/item/aside/header/b").click()  # "1층2층 공조기1_09" 클릭
    
    # ACP5.shutdown()




