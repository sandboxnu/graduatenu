if [[ $# != 2 ]]; then
  echo "Usage: get-ecr-image-name.sh <COMMIT_TAG | latest-main | local-head> <frontend | backend>"
  exit 1
fi

if [[ ${#1} = 40 ]]; then
  ECR_IMAGE_COMMIT_HASH=$1
elif [[ $1 = "latest-main" ]]; then
  ECR_IMAGE_COMMIT_HASH=$(git ls-remote https://github.com/sandboxnu/graduatenu.git main | awk '{ print $1 }')
elif [[ $1 = "local-head" ]]; then
  ECR_IMAGE_COMMIT_HASH=$(git rev-parse HEAD)
else
  echo "ERROR: Invalid commit '$1'"
  exit 1
fi

if [[ $2 = "frontend" ]]; then
  REPO="graduatenu-node"
elif [[ $2 = "backend" ]]; then
  REPO="graduatenu-rails"
else
  echo "Please choose a service to deploy: 'frontend' or 'backend'"
  exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_DEFAULT_REGION="us-east-1"

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"

ECR_IMAGE_NAME="${ECR_REGISTRY}/${REPO}:${ECR_IMAGE_COMMIT_HASH}"

echo $ECR_IMAGE_NAME
