### To run the backend

Ensure you are in the root of the server directory,
Then run the following commands in the terminal:

#### Start the python virtual environment:

`python -m venv .venv` \
`source .venv/bin/activate` \
`pip install -r requirements.txt`

#### to run postgres inside the Docker container/start the database server:

`docker compose up -d`

#### connect and enter into the database server:

`docker compose exec postgres psql -U postgres`

Once you are logged into psql. Use the following commands to create a database for this project, make it your current database, and then load in our table and sample data:

#### List all databases

postgres=# `\l`

#### Connect to our database

postgres=# `\c chefgpt`

#### Load the database schema and any sql commands in the file data injection aka seed the database

<database name>=# `\i data/chefgpt.sql;`

#### list all tables

`\dt`

tips: Run sql queries here to check data injection into the database, Test requests in the fastapi docs UI, and watch the FastAPI server in the terminal for error logs.

#### You can log out of your database with

`exit`

# Run the web server:

`fastapi dev main.py`

## In your browser, go to

http://localhost:8000/docs

minio s3 image store
Make sure you login at http://localhost:9001/ using minioadmin as both username and password

Current photo buckets:
profile-photos
recipes-photos
