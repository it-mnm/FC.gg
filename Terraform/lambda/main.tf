# AWS 공급자 설정
provider "aws" {
  access_key = ""    # 액세스 키
  secret_key = ""    # 비밀 키
  region     = ""    # 지역
}

# IAM 정책 문서 생성
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    # 서비스 유형의 IAM 역할에 대한 권한 부여
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]    # Lambda 서비스
    }

    # AssumeRole 작업에 대한 허용
    actions = ["sts:AssumeRole"]
  }
}

# IAM 역할 생성
resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"    # IAM 역할 이름
  assume_role_policy = data.aws_iam_policy_document.assume_role.json    # IAM 역할의 AssumeRole 정책
}

# Lambda 함수 소스코드 압축
data "archive_file" "lambda" {
  type        = "zip"
  source_file = "Getouid.py"    # Lambda 함수의 소스코드 파일
  output_path = "Getouid_function_payload.zip"    # 압축된 Lambda 함수 소스코드의 출력 경로
}

# Lambda 함수 정의
resource "aws_lambda_function" "terraformtest" {
  filename           = "Getouid_function_payload.zip"    # Lambda 함수의 ZIP 파일 경로
  function_name      = "terraformtest"    # Lambda 함수의 이름
  role               = aws_iam_role.iam_for_lambda.arn    # Lambda 함수를 실행하는 IAM 역할
  handler            = "handle_request"    # Lambda 함수의 핸들러
  runtime            = "python3.12"    # Lambda 함수의 런타임 환경
  source_code_hash   = data.archive_file.lambda.output_base64sha256    # 압축된 소스코드의 해시값
}
