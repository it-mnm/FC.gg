import json
import urllib.request
import urllib.parse
def Getouid(event, context):
    try:
        # nickname 가져오기
        nickname = urllib.parse.unquote(event['queryStringParameters']['nickname'])
        # 요청 URL 설정
        base_url = "https://open.api.nexon.com/fconline/v1/id"
        query_params = {'nickname': nickname}
        url = base_url + "?" + build_query_params(query_params)
        # 요청 보내기
        headers = {
            'accept': 'application/json',
            'x-nxopen-api-key': 'test_f15f9ee815ab4be133e13c2028780bfc1375fec5c24fbe5b2436a1070879273300ad5d0d0126614ece0a1c1c2d180b62'
        }
        req = urllib.request.Request(url, headers=headers, method='GET')
        with urllib.request.urlopen(req) as response:
            response_data = json.loads(response.read().decode())
        # "ouid" 필드의 값을 추출하여 반환
        ouid = response_data.get('ouid', '')
        print("ouid:", ouid)
        return ouid
    except Exception as e:
        print("Error occurred:", str(e))
        return "Error occurred: " + str(e)
# Query Parameters를 문자열로 변환하는 함수
def build_query_params(params):
    return urllib.parse.urlencode(params)