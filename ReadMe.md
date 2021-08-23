# Autosemantics DDC data WebAPI
* DDC로부터 데이터를 받아오도록 만든 스크립트들입니다.
* 내부에 data 쓰기를 위해 파일 경로를 사용하는 부분이있는데 VScode로 작업하면서 상대 경로가 꼬인 관계로 해당 부분에서 문제가 있을 시 수정이 필요할 수 있습니다.
1. source/LG/ACP5/src/GetCP.py 가 ACP5의 데이터를 받아오도록 만든 스크립트입니다.
2. source/LG/ACP4/src/GetCP.py에 있는 ACP4의 경우 현재 데이터 취득에 어려움이 있어서 아마 작동하지 않을 듯 싶습니다.
3. source/SAMSUNG/src/GetCP.py에 있는 삼성 dms 의 기기의 경우 데이터를 담고 있을 것이라 추정되는 곳에 접근은 되나 실제 연결된 기기가 없어 NULL밖에 얻을 수 없는 상태입니다.
