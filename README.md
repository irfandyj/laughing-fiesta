# Getting Started
1. Install Docker and Docker Compose
2. Go to `infra` directory
3. Run `docker compose -d up`
4. Get the MongoDB IP Address, will be detailed later on
5. Copy the IP Address and replace a variable `DB_HOST` in `api/src/db/init.js`
6. Start the SAM app by going to `api` folder
7. Run `sam local start-api --docker-network infra_default`