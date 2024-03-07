import json
import urllib.request
import urllib.parse

def get_match_detail(event, context):
    try:
        api_key = "test_f15f9ee815ab4be133e13c2028780bfc1375fec5c24fbe5b2436a1070879273300ad5d0d0126614ece0a1c1c2d180b62"
        match_id = event["queryStringParameters"]["matchid"]


        base_url = "https://open.api.nexon.com/fconline/v1/match-detail"
        query_params = {'matchid': match_id}
        url = base_url + "?" + urllib.parse.urlencode(query_params)



        # GET 요청 보내기
        req = urllib.request.Request(url, headers={
            "accept": "application/json",
            "x-nxopen-api-key": "test_f15f9ee815ab4be133e13c2028780bfc1375fec5c24fbe5b2436a1070879273300ad5d0d0126614ece0a1c1c2d180b62"
        })
        with urllib.request.urlopen(req) as response:
            response_data = response.read().decode("utf-8")

        # 응답 반환
        return response_data

    except Exception as e:
        print(e)
        return f"Error occurred: {str(e)}"


