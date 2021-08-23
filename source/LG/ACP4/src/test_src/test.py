#-*- coding: utf-8 -*-
#python3
import json

import selenium
from selenium import webdriver
from selenium.webdriver import ActionChains

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait

class GenDriver:
    def __init__(self, address: str):
        self.options = webdriver.ChromeOptions()
        # skip ssl
        self.options.add_argument("--ignore-certificate-errors")
        self.driver = webdriver.Chrome(chrome_options=self.options)
        self.address = address

    def shutdown(self):
        self.driver.quit()

    def get_URL(self):
        # Load URL
        self.driver.get(self.address)
        self.driver.implicitly_wait(3)

        # Login
        try:
            self.driver.find_element_by_xpath("/html/body/div/section/main/form/group[1]/input").send_keys("admin")
            self.driver.find_element_by_xpath("/html/body/div/section/main/form/group[2]/input").send_keys("digital2121")
            self.driver.find_element_by_xpath("/html/body/div/section/main/form/input").click()

        except:
            return

    def Loading(self, Xpath, delay=20):
        WebDriverWait(self.driver, delay).until(EC.presence_of_element_located((By.XPATH, Xpath)))

    def GetElement(self, Xpath):
        element = self.driver.find_element_by_xpath(Xpath)
        return element


if __name__ == '__main__':

    URL = 'https://192.168.92.106/#/master/dashboard'
    
    ACP5 = GenDriver(URL)
    ACP5.get_URL()

    
    # # Go to control panel
    ACP5.Loading("/html/body/div/main/content/inventory/deck[2]/item/article/content/div[1]")
    # ACP5.driver.get("https://192.168.92.106/#/master/control/facility")

    # # Get control value
    # ACP5.Loading("/html/body/div/main/div/content/div[2]/div/group/group[2]/inventory/deck[1]/item/aside/header/b")
    # ACP5.GetElement("/html/body/div/main/div/content/div[2]/div/group/group[2]/inventory/deck[1]/item/aside/header/b").click()  # "1층2층 공조기1_09" 클릭

    # ACP5.Loading("/html/body/div/main/div/content/div[2]/div/group/group[2]/inventory/deck[1]/item/aside/header/b")
    # ACP5.GetElement("/html/body/div/main/aside/content[2]/tab/li[2]").click()   # "장치정보" 클릭
    
    # ACP5.Loading("/html/body/div/main/aside/content[2]/switch/case[2]/ul/li[4]/header/span")
    # ACP5.GetElement("/html/body/div/main/aside/content[2]/switch/case[2]/ul/li[2]/header").click()  # "동작 / 운정 정보" 클릭
    # # print(devName.text + ' 현재 온도 : ' + Temp)

    # Javescript method 실행
    # ACP5.driver.execute_script("alert('Javescript Execution Test...')")
    # ACP5.driver.execute_script("alert(arguments[0].cp_attr);", AHU)
    ACP5.driver.implicitly_wait(3)

    # r = ACP5.driver.execute_script("return window.performance.getEntries();")
    # for res in r:
    #     print(res)

    # test = ACP5.driver.execute_script("var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {}; var network = performance.getEntries() || {}; return network;")
    # for item in test:
    #     print(item)
    
    ACP5.driver.header_overrides = {'Referer': 'referer_string',}
    ACP5.driver.get("https://192.168.92.106/api/wapi/get_lpoint_all_small")

    cookie = ACP5.driver.get_cookies()
    for items in cookie:
        print(items, '\n')









    # driver.implicitly_wait(time_to_wait=10)
    # driver.close()
