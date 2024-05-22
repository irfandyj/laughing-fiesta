# Getting Started

## Setup Backend and MongoDB
1. Install Docker and Docker Compose
2. Go to `infra` directory
3. Run `docker compose -d up`
4. Get the MongoDB IP Address, will be detailed later on by running `docker inspect infra-mongo-1`
5. Copy the IP Address under `Networks -> IPAddress` and replace a variable `DB_HOST` in `api/src/db/init.js`
6. Start the SAM app by going to `api` folder
7. Run `sam local start-api --docker-network infra_default`
8. API should be available at `http://localhost:3000`

## Setup for Client
1. Make sure you have NodeJS
2. Install yarn globally `npm i -g yarn`
3. Install dependencies `yarn`
4. Start the development server `yarn start`
5. Go to `http://localhost:8000`

## Setup for Websocket
This is unfinished though
1. Make sure you have NodeJS
2. Install dependencies `npm i`
3. Run `npm run dev`

# References
1. [npm link](https://medium.com/@jophin.joseph88/npm-link-2f35c7e1ac33)