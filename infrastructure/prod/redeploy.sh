#!/bin/bash

if [[ ! " prod staging " =~ " $1 " ]]; then
  echo "Please provide environment to use: prod or staging"
  exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_DEFAULT_REGION="us-east-1"
REPOS=( "graduatenu-rails" "graduatenu-node" )
LATEST_HASH=$(git ls-remote https://github.com/sandboxnu/graduatenu.git aryan/style-delete-on-drag-outside | awk '{ print $1 }')
ECS_CLUSTER="$1-graduatenu"
TASK_FAMILIES=( "${ECS_CLUSTER}-api" "${ECS_CLUSTER}-web" )
SERVICES=( "${ECS_CLUSTER}-api" "${ECS_CLUSTER}-web" )

# Disable aws from sending stdout to less
export AWS_PAGER=""

echo "Redeploying services for cluster: ${ECS_CLUSTER} with last pushed image"


for i in "${!REPOS[@]}"; do
    # Last pushed image should always be tagged with the latest commit hash on main 
    ECR_IMAGE="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${REPOS[$i]}:${LATEST_HASH}"
    TASK_FAMILY="${TASK_FAMILIES[$i]}"
    SERVICE="${SERVICES[$i]}"
    # fetch template for task definition 
    TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition "$TASK_FAMILY" --region "$AWS_DEFAULT_REGION")
    # update the template's image to use the latest ECR_IMAGE
    NEW_TASK_DEFINTIION=$(echo $TASK_DEFINITION | jq --arg IMAGE "$ECR_IMAGE" '.taskDefinition | .containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)')
    # register the new revision for the task definition 
    NEW_TASK_INFO=$(aws ecs register-task-definition --region "$AWS_DEFAULT_REGION" --cli-input-json "$NEW_TASK_DEFINTIION")
    NEW_REVISION=$(echo $NEW_TASK_INFO | jq '.taskDefinition.revision')
    # update the service to replace tasks with the latest revision using the latest image
    aws ecs update-service --cluster ${ECS_CLUSTER} \
                        --service ${SERVICE} \
                        --task-definition ${TASK_FAMILY}:${NEW_REVISION}
done

echo "Check AWS Console for logs"