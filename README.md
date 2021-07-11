# Consensys test - Meeting room booking
Very simple solution for the meeting room booking problem. It consists of a REST api with a few endpoints to handle user registration and room booking.

## Requirements
If running using Docker, just Docker and Docker Compose are required. Otherwise Node 14 and a Postgres database are required.

## Project setup
In both `booking-api` and `database` folders there is a file called .env.example. Please copy their contents into a file called .env in their respective folders, and set the desired key values and postgres credentials that match with one another.

Note that the .env file for the database is used just when using Docker to create it, if running a database out of Docker setting up credentials in this file is not required.

## Docker run
From the root folder of the repository, run:

```
docker-compose up
```

The API should be running on port 5000 of the docker machine.

Note:

## Build and run on local host
From the `booking-api` folder, run:
```
npm install
npm run build
npm start
```
The API should be running on port 5000.

## Test
From the `booking-api` folder, run:
```
npm run test
```

## API endpoints
`POST /register`
- Description: Register a new user on the system.
- Body parameters (JSON):
  - username
  - password
  - name

`POST /login`
- Description: Log in and get a JWT token to be able to book meeting rooms.
- Body parameters (JSON):
  - username
  - password

`POST /booking`
- Description: Book a meeting room.
- Body parameters (JSON):
  - slot: Number from 0 to 23 indicating the start of the meeting (from 00:00 to 23:00, respectively).
  - roomId: uuidv4 id of the room to book.

`GET /booking/availability`
- Description: Get all available rooms for a time slot.
- Query string parameters:
  - slot: Number from 0 to 23 indicating the start of the meeting (from 00:00 to 23:00, respectively)
