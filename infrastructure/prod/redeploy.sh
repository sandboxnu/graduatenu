#!/bin/bash

if [[ $# != 3 ]]; then
  echo "Usage: redeploy.sh <prod | staging> <COMMIT_TAG | latest-main | local-head> <backend>"
  exit 1
fi

if [[ ! " prod staging " =~ " $1 " ]]; then
  echo "Please provide environment to use: prod or staging"
  exit 1
fi

# Accept a few different formats for the commit hash.
if [[ ${#2} = 40 ]]; then
  ECR_IMAGE_COMMIT_HASH=$2
elif [[ $2 = "latest-main" ]]; then
  ECR_IMAGE_COMMIT_HASH=$(git ls-remote https://github.com/sandboxnu/graduatenu.git main | awk '{ print $1 }')
elif [[ $2 = "local-head" ]]; then
  ECR_IMAGE_COMMIT_HASH=$(git rev-parse HEAD)
else
  echo "ERROR: Invalid commit '$2'"
  exit 1
fi

# Only deploy the service specified.
# if [[ $3 = "frontend" ]]; then
#   DEPLOY_INDEXES=(1)
# elif [[ $3 = "backend" ]]; then
#   DEPLOY_INDEXES=(0)
# elif [[ $3 = "both" ]]; then
#   DEPLOY_INDEXES=(0 1)
# else
#   echo "Please choose a service to deploy: 'frontend', 'backend', or 'both'"
#   exit 1
# fi

# if [[ $3 = "backend" ]]; then
#   DEPLOY_INDEXES=(0)
# else
#   echo "This script only supports backend AWS deployments. To deploy frontend, check Vercel."
#   exit 1
# fi
DEPLOY_INDEXES=(0)

echo "Deploying $3 repo(s) to $1 with commit "$2" ($ECR_IMAGE_COMMIT_HASH)"

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_DEFAULT_REGION="us-east-1"
REPOS=( "graduatenu-rails" "graduatenu-node" )
ECS_CLUSTER="$1-graduatenu"
TASK_FAMILIES=( "${ECS_CLUSTER}-api" "${ECS_CLUSTER}-web" )
SERVICES=( "${ECS_CLUSTER}-api" "${ECS_CLUSTER}-web" )


# Disable aws from sending stdout to less
export AWS_PAGER=""

for service_index in "${!DEPLOY_INDEXES[@]}"; do
    echo "Deploying ${REPOS[DEPLOY_INDEXES[service_index]]}..."
    i=${DEPLOY_INDEXES[service_index]}
    # Last pushed image should always be tagged with the latest commit hash on main 
    ECR_IMAGE="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${REPOS[$i]}:${ECR_IMAGE_COMMIT_HASH}"
    TASK_FAMILY="${TASK_FAMILIES[$i]}"
    SERVICE="${SERVICES[$i]}"
    # fetch template for task definition 
    TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition "$TASK_FAMILY" --region "$AWS_DEFAULT_REGION")
    # update the template's image to use the latest ECR_IMAGE
    NEW_TASK_DEFINITION=$(echo $TASK_DEFINITION | jq --arg IMAGE "$ECR_IMAGE" '.taskDefinition | .containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)')
    # register the new revision for the task definition 
    NEW_TASK_INFO=$(aws ecs register-task-definition --region "$AWS_DEFAULT_REGION" --cli-input-json "$NEW_TASK_DEFINITION")
    NEW_REVISION=$(echo $NEW_TASK_INFO | jq '.taskDefinition.revision')
    # update the service to replace tasks with the latest revision using the latest image
    aws ecs update-service --cluster ${ECS_CLUSTER} \
                        --service ${SERVICE} \
                        --task-definition ${TASK_FAMILY}:${NEW_REVISION}
done

echo "Check AWS Console for logs"