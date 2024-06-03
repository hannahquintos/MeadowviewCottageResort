//import required modules
const express = require("express"); 
const cors = require("cors"); //need this to set this API to allow requests from other servers
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const openweathermap = require("./openweathermap");


//DB values
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/`;
const client = new MongoClient(dbUrl);

//set up Express object and port
const app = express();
const port = process.env.PORT || "3000";

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

//allow requests from all servers
app.use(cors({
  origin: "*"
}));


//API endpoints

/*
 * returns: an json object of current weather
 */
app.get("/api/weather", async (request, response) => {
  let weather = await openweathermap.getWeather();
  response.json(weather);
});

/*
 * returns: an array of events
 */
app.get("/api/events", async (request, response) => {
  let events = await getAllEvents();
  response.json(events); //send JSON object with appropriate JSON headers
});

/*
 * returns: json object of selected event
 */
app.get("/api/events/:id", async (request, response) => {
  let eventId = request.params.id;
  let event = await getSingleEvent(eventId);
  response.json(event);
});

/*
 * returns: an array of activities
 */
app.get("/api/activities", async (request, response) => {
  let activities = await getAllActivities();
  response.json(activities); //send JSON object with appropriate JSON headers
});

/*
 * returns: json object of selected activity
 */
app.get("/api/activities/:id", async (request, response) => {
  let activityId = request.params.id;
  let activity = await getSingleActivity(activityId);
  response.json(activity);
});

// retrieve values from submitted create activity POST form
app.post("/api/activities/create", async (request, response) => {
  let status = request.body.status;
  let activityName = request.body.activityName;
  let startTime = request.body.startTime;
  let endTime = request.body.endTime;
  let location = request.body.email;
  let image = request.body.city;
  let description = request.body.description;
  let newActivity = {
    "status": status,
    "activityName": activityName,
    "startTime": startTime,
    "endTime": endTime,
    "location": location,
    "image": image,
    "description": description
  };
  await addActivity(newActivity);
});

/*
 * returns: an array of equipment
 */
app.get("/api/equipment", async (request, response) => {
  let equipment = await getAllEquipment();
  response.json(equipment); //send JSON object with appropriate JSON headers
});

/*
 * returns: json object of selected equipment
 */
app.get("/api/equipment/:id", async (request, response) => {
  let equipmentId = request.params.id;
  let equipment = await getSingleEquipment(equipmentId);
  response.json(equipment);
});


//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

//MONGODB FUNCTIONS
async function connection() {
  await client.connect();
  db = client.db("MeadowviewDb");
  return db;
}

//Function to select all documents in the events collection
async function getAllEvents() {
  db = await connection();
  let results = db.collection("events").find({});
  let res = await results.toArray();
  return res;
}

//Function to retrieve a single document from events by _id
async function getSingleEvent(id){
  db = await connection();
  const eventId = { _id: new ObjectId(String(id)) };
  const result = await db.collection("events").findOne(eventId); 
  return result;
}

//Function to select all documents in the activities collection
async function getAllActivities() {
  db = await connection();
  let results = db.collection("activities").find({});
  let res = await results.toArray();
  return res;
}

//Function to retrieve a single document from activities by _id
async function getSingleActivity(id){
  db = await connection();
  const activityId = { _id: new ObjectId(String(id)) };
  const result = await db.collection("activities").findOne(activityId); 
  return result;
}

//Function to insert an activity document
async function addActivity(activityData) {
  db = await connection();
  let status = await db.collection("activities").insertOne(activityData);
}

//Function to select all documents in the equipment collection
async function getAllEquipment() {
  db = await connection();
  let results = db.collection("equipment").find({});
  let res = await results.toArray();
  return res;
}

//Function to retrieve a single document from equipment by _id
async function getSingleEquipment(id){
  db = await connection();
  const equipmentId = { _id: new ObjectId(String(id)) };
  const result = await db.collection("equipment").findOne(equipmentId); 
  return result;
}