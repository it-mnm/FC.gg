import boto3

# 액세스 키와 시크릿 키를 사용하여 세션 생성
session = boto3.Session(
    aws_access_key_id='<aws_access_key_id>',
    aws_secret_access_key='<aws_secret_access_key>',
    region_name='<region_name>'
)

# DynamoDB 리소스 생성
dynamodb = session.resource('dynamodb')

# DynamoDB 테이블 선택
table = dynamodb.Table('FC.GG')

# 아이템 삽입
response = table.put_item(
   Item={
        'ID': '1234',  # 아이템의 키(ID)
        'name': '호날두',  # 아이템의 다른 속성 및 값
        # 다른 속성 및 값들을 여기에 추가할 수 있습니다.
    }
)

print("PutItem succeeded:")
print(response)
