#!/bin/bash
set -e

SERVER="postgres_db_server";
PW="secret-password";
DB="magic_db";

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker run --name $SERVER -e POSTGRES_PASSWORD=$PW \
  -e PGPASSWORD=$PW \
  -p 5442:5432 \
  -d postgres

# wait for pg to start
echo "sleep wait for pg-server [$SERVER] to start";
sleep 8;

# create the db
echo "CREATE DATABASE $DB ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres
# Required by typeorm migrations
echo "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"" | docker exec -i $SERVER psql -U postgres --dbname=$DB
echo "\l" | docker exec -i $SERVER psql -U postgres
