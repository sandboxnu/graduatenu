if [[ ! " backend frontend " =~ " $1 " ]]; then
  echo "Please provide ECR repo to use: backend or frontend"
  exit 1
fi

CURRENT_HASH=$( git rev-parse HEAD )

if [[ $1 = "backend" ]]; then
  REPO="graduatenu-rails"
fi

if [[ $1 = "frontend" ]]; then
  REPO="graduatenu-node"
fi

AWS_DEFAULT_REGION="us-east-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"

ECR_IMAGE_NAME="${ECR_REGISTRY}/${REPO}:${CURRENT_HASH}"

echo $ECR_IMAGE_NAME
