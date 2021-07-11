# Consensys test - Meeting room booking
Very simple solution for the meeting room booking problem. It consists of a REST api with a few endpoints to handle user registration and room booking.

## Build and run
From the `booking-api` folder, run:
```
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
  - slot: Number from 0 to 23 indicating the start of the meeting (from 00:00 to 23:00, respectively)
  - roomId: uuidv4 id of the room to book

`GET /booking/availability`
- Description: Get all available rooms from a time slot
- Query string parameters:
  - slot: Number from 0 to 23 indicating the start of the meeting (from 00:00 to 23:00, respectively)
