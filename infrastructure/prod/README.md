# How to do a Manual Deploy (to staging or prod).

Note: All of the `yarn` scripts in this guide are in the root `package.json`.

**This will deploy the current files as they are in your local repo**. They will be tagged with the local HEAD commit.

If you don't want this, you'll need to run modified calls rather than the package.json scripts directly.

## Prereqs:

- Install Docker
- Install the AWS CLI
- Have an AWS Access Key ID and AWS Secret Access Key pair.
- Run `aws configure`, and input those keys along with us-east-1 as the region. Leave the Default Output Format as None.

## Steps:

1. Run `yarn frontend:build` and/or `yarn backend:build` depending on what you want to build.
2. Run `yarn frontend:run` and/or `yarn backend:run` to test that the image runs (the backend won't be able to connect to the database which is expected, and the frontend will not connect to the backend).
3. You may have to run `yarn ecr:docker:auth` to reauthenticate Docker with AWS ECR. (There is no harm in running this command unnecessarily, so if you're unsure you can just run it).
4. If the images run successfully, run `yarn frontend:push` and/or `yarn backend:push` to push the built images to AWS ECR.
5. Run `./infrastructure/prod/redeploy.sh <environment> local-head <service>`

   `<environment>` is either `prod` or `staging`.  
   `<service>` is one of `frontend`, `backend`, or `both`.

# How to Manually Redeploy a Previously Deployed Commit

If you know that a commit already has an image pushed to ECR (ex. the commit is in main, or you already pushed the image using the above steps) and you want to deploy that particular image to staging or prod, you can use the redeploy.sh script.

1. Find the commit's hash (looks like this: 1445f9533c4ec9a7324c721f09fc5ccec1542d8d).
2. Run `./infrastructure/prod/redeploy.sh <environment> <commit_hash> <service>`

   `<environment>` is either `prod` or `staging`.  
   `<commit_hash>` is the hash of the commit you just found.  
   `<service>` is one of `frontend`, `backend`, or `both`.
