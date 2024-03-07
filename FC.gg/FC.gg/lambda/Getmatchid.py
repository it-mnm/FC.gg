import json
import urllib.parse
import urllib.request

def lambda_handler(event, context):
    try:
        # Parameters
        ouid = event["queryStringParameters"]["ouid"]
        matchtype = event["queryStringParameters"]["matchtype"]
        offset = event["queryStringParameters"]["offset"]
        limit = event["queryStringParameters"]["limit"]
        
        # Request URL
        baseUrl = "https://open.api.nexon.com/fconline/v1/user/match"
        queryParams = {
            "ouid": ouid,
            "matchtype": matchtype,
            "offset": offset,
            "limit": limit
        }
        url = baseUrl + "?" + urllib.parse.urlencode(queryParams)
        
        # HTTP Request
        req = urllib.request.Request(url, headers={
            "accept": "application/json",
            "x-nxopen-api-key": "test_f15f9ee815ab4be133e13c2028780bfc1375fec5c24fbe5b2436a1070879273300ad5d0d0126614ece0a1c1c2d180b62"
        })
        with urllib.request.urlopen(req) as response:
            responseBody = response.read().decode("utf-8")
            print("Match Response: " + responseBody)
            return responseBody
        
    except Exception as e:
        print("Error occurred:", str(e))
        return "Error occurred: " + str(e)
