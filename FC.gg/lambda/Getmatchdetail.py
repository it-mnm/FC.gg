import json
import urllib.request
import urllib.parse
import boto3

def get_match_detail(event, context):
    try:
        api_key = "test_f15f9ee815ab4be133e13c2028780bfc1375fec5c24fbe5b2436a1070879273300ad5d0d0126614ece0a1c1c2d180b62"
        match_id = event["queryStringParameters"]["matchid"]
        nickname = event["queryStringParameters"]["nickname"]

        base_url = "https://open.api.nexon.com/fconline/v1/match-detail"
        query_params = {'matchid': match_id}
        url = base_url + "?" + urllib.parse.urlencode(query_params)



        # GET 요청 보내기
        req = urllib.request.Request(url, headers={
            "accept": "application/json",
            "x-nxopen-api-key": api_key
        })
        with urllib.request.urlopen(req) as response:
            response_data = response.read().decode("utf-8")
        print("url 요청 보내기는 성공")

        # 내 선수 조회
        #spRating = 0.0 인 경우에는 교체 선수들임
        data_dict = json.loads(response_data)

            #내 정보 찾기, #추후에 입력한 닉네임 값을 받아와야 함.
        if data_dict['matchInfo'][0]['nickname'] == nickname :
            my_player = data_dict['matchInfo'][0]['player']
            my_status = data_dict['matchInfo'][0]['matchDetail']['matchResult']
            my_score = data_dict['matchInfo'][0]['shoot']['goalTotal']

            other_player = data_dict['matchInfo'][1]['player']
            other_status = data_dict['matchInfo'][1]['matchDetail']['matchResult']
            other_score = data_dict['matchInfo'][1]['shoot']['goalTotal']
            other_nick = data_dict["matchInfo"][1]['nickname']
        else :
            my_player = data_dict['matchInfo'][1]['player']
            my_status = data_dict['matchInfo'][1]['matchDetail']['matchResult']
            my_score = data_dict['matchInfo'][1]['shoot']['goalTotal']

            other_player = data_dict['matchInfo'][0]['player']
            other_status = data_dict['matchInfo'][0]['matchDetail']['matchResult']
            other_score = data_dict['matchInfo'][0]['shoot']['goalTotal']
            other_nick = data_dict["matchInfo"][0]['nickname']
        position_mapping = {
        0: "GK", 1: "SW", 2: "RWB", 3: "RB", 4: "RCB", 5: "CB",
        6: "LCB", 7: "LB", 8: "LWB", 9: "RDM", 10: "CDM", 11: "LDM",
        12: "RM", 13: "RCM", 14: "CM", 15: "LCM", 16: "LM", 17: "RAM", 18: "CAM", 19: "LAM",
        20: "RF", 21: "CF", 22: "LF", 23: "RW", 24: "RS", 25: "ST", 26: "LS", 27: "LW", 28: "SUB" 
        }
        my_player_data = []
        for item in my_player:
            if item.get('spPosition') != 28 :
                    extracted_item = {
                        'spId': item['spId'],
                        'spPosition': position_mapping.get(item['spPosition'], 'Unknown'),
                        'spGrade': item['spGrade'],
                        'status' : item['status']['spRating'],
                        'goal' : item['status']['goal']
                    }
                    my_player_data.append(extracted_item)

            
        other_player_data = []
        for item in other_player:
            if item.get('spPosition') != 28 :
                    extracted_item = {
                        'spId': item['spId'],
                        'spPosition': item['spPosition'],
                        'spGrade': item['spGrade'],
                        'status' : item['status']['spRating'],
                        'goal' : item['status']['goal']
                    }
                    other_player_data.append(extracted_item)
        
        print("data 설정 완료")            
        my_ids = [item['spId'] for item in my_player_data]
        other_ids = [item['spId'] for item in other_player_data]
        #db 접속
        table_name = 'FC.GG-playerinfo'

        # AWS SDK를 사용하여 DynamoDB에 접속
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table(table_name)
        print("db 접속 완료")
        my_data = []
        other_data = []
        
        for spId in my_ids:
            response = table.get_item(Key={'id': spId})
            if 'Item' in response:
                my_data.append(response['Item'])
        
        for spId in other_ids:
            response = table.get_item(Key={'id': spId})
            if 'Item' in response:
                other_data.append(response['Item'])        

        print("db 조회 완료")

        return_data = {
            'my_player_data': my_player_data,
            'my_status': my_status,
            'my_score': my_score,
            'my_data': my_data,

            'other_player_data': other_player_data,
            'other_status': other_status,
            'other_score': other_score,
            'other_data': other_data,
            'other_nick': other_nick
        }
    
        return return_data

    except Exception as e:
        print(e)
        return f"Error occurred: {str(e)}"

