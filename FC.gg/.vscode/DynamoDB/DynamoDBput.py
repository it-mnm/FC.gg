import boto3
import csv
from io import StringIO
# AWS 계정 자격 증명 로드
session = boto3.Session(
    aws_access_key_id='<aws_access_key_id>',
    aws_secret_access_key='<aws_secret_access_key>',
    region_name='<region_name>'
)

# DynamoDB 리소스 생성
dynamodb = session.resource('dynamodb')

# DynamoDB 테이블 선택
table = dynamodb.Table('FC.GG')

# S3 버킷 이름
bucket_name = 'fc.gg'

# S3 객체 키 (파일 경로)
s3_key = '선수정보.csv'

# S3 객체 생성
s3 = session.client('s3')

try:
    # S3 객체 가져오기
    response = s3.get_object(Bucket=bucket_name, Key=s3_key)
    # CSV 파일 내용을 문자열로 읽기
    csv_content = response['Body'].read().decode('utf-8')
    # CSV 파일 내용을 읽어들이기 위해 StringIO 객체로 변환
    csv_file = StringIO(csv_content)

    # CSV 파일 읽기
    csv_reader = csv.reader(csv_file)
    next(csv_reader)  # 헤더 행 건너뛰기

    # CSV 파일 읽어서 DynamoDB에 삽입
    for row in csv_reader:
        response = table.put_item(
            Item={
                'id': row[0],
                'name': row[1],
                'sid': row[2],
                'className': row[3],
                'seasonImg': row[4],
                'spid': row[5],
                'p_image': row[6],
                'p_action_image': row[7]
                # 필요한 경우 추가 필드를 여기에 추가할 수 있습니다.
            }
        )
        print("PutItem succeeded:", response)

except Exception as e:
    print("Error:", e)