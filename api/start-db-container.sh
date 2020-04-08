# check if our postgres container is not up
if [ ! "$(docker ps -q -f name=graduatenu_postgres)" ]; then
    # if the container exists but exited remove it
    if [ "$(docker ps -aq -f status=exited -f name=graduatenu_postgres)" ]; then
        # cleanup
        docker rm graduatenu_postgres
    fi
    # run our container
    docker run --name graduatenu_postgres  -e POSTGRES_PASSWORD=graduatenu -v graduatenu_dbdata:/var/lib/postgresql/data -p 5432:5432  -d postgres
fi