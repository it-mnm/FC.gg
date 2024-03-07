import json
import urllib.request
import urllib.parse
import pandas as pd

def get_match_detail():
    api_key = "test_f15f9ee815ab4be133e13c2028780bfc1375fec5c24fbe5b2436a1070879273300ad5d0d0126614ece0a1c1c2d180b62"

    try:
        # 요청 URL 설정
        base_url = "https://open.api.nexon.com/static/fconline/meta/spid.json"
        

        # 요청 헤더 설정
        headers = {
            "x-nxopen-api-key": api_key,
            'accept': 'application/json'
        }

        # GET 요청 보내기
        req = urllib.request.Request(base_url, headers=headers)
        with urllib.request.urlopen(req) as response:
            response_data = response.read().decode()

        df = pd.DataFrame(json.loads(response_data))
        print(df)
        df.to_csv('C:/Users/Hwang/Desktop/FC.gg/FC.gg/lambda/Data/player_pid.csv', index=False)
        # 응답 반환
        return response_data

    except Exception as e:
        print(e)
        return f"Error occurred: {str(e)}"

get_match_detail()
