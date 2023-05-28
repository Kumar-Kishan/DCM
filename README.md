# Setup Instructions

## Collection Worker

- Navigate to collection worker `cd CollectionWorker`
- Install the dependencies `npm install`
- Start worker to create a bee for storing data and listening to agent connection and bee replication server `node worker.mjs`
- This will spit out agent topic, bee topic and bee key.

## Server

- Navigate to server `cd Server`
- Copy the bee key to .env file in Server folder
- Start the server with `node index.mjs`

## Agent

- Navigate to Agent `cd Agent`
- Build the docker image `docker build -t agent .`
- Make sure agent topic is same in `start.ps1`
- Start agents with `./start.ps1` This will gradually spin up servers and spit out temperature

## Frontend

- Navigate to frontend `cd frontend`
- Install the dependencies `npm install`
- Copy the server url to App.jsx for socket connection
- Start the frontend with `npm start`

Gradually you will see the servers being added to the frontend and temperature being displayed.

## Screenshots

Screenshots of the frontend are in the screenshots folder.

![Screenshot 1](/screenshots/1.jpg)
![Screenshot 2](/screenshots/2.jpg)
![Screenshot 3](/screenshots/3.jpg)
![Screenshot 4](/screenshots/4.jpg)
