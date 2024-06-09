//import required modules
const express = require("express"); 
const cors = require("cors"); //need this to set this API to allow requests from other servers
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const openweathermap = require("./openweathermap");

dotenv.config();


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
 * retrieve email and login values from the login form
 */
app.post("/api/login", async (request, response) => {
  const{email, password}=request.body;

  try{
    const validUser = await checkUser(email, password);
    if(validUser){
      response.json("exist");
    } else{
      response.json("notexist");
    }
  }
  catch(e){
    response.json("notexist");
  }

});

/*
 * retrieve email and login values from the login form
 */
app.post("/api/signup", async (request, response) => {
  const{email, password}=request.body;

  const newUser = {
    email: email,
    password: password
  };

  try{
    const validEmail = await checkEmail(email);
    if(validEmail){
      response.json("exist");
    } else{
      response.json("notexist");
      console.log("newUser: " + newUser);
      await addUser(newUser);
    }
  }
  catch(e){
    response.json("notexist");
    console.log("error");
  }

});

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
  // let activityName = request.body.activityName;
  // let startTime = request.body.startTime;
  // let endTime = request.body.endTime;
  // let location = request.body.location;
  // let image = request.body.image;
  // let description = request.body.description;
  // let newActivity = {
  //   "activityName": activityName,
  //   "startTime": startTime,
  //   "endTime": endTime,
  //   "location": location,
  //   "image": image,
  //   "description": description
  // };
  // await addActivity(newActivity);

  // console.log('Request received');
  // response.json({ message: 'Test successful' });

  console.log('Request received'); // Debugging statement

  // Logging request body
  console.log('Request body:', request.body);

  let activityName = request.body.activityName;
  let startTime = request.body.startTime;
  let endTime = request.body.endTime;
  let location = request.body.location;
  let image = request.body.image;
  let description = request.body.description;

  let newActivity = {
    activityName: activityName,
    startTime: startTime,
    endTime: endTime,
    location: location,
    image: image,
    description: description
  };

  await addActivity(newActivity);
  response.json({ Activity: newActivity });

  // try {
  //   await addActivity(newActivity);
  //   // console.log('Activity added:', newActivity); // Debugging statement
  //   // response.json({ message: 'Activity created successfully' });
  // } catch (error) {
  //   console.error('Error adding activity:', error);
  //   // response.status(500).json({ message: 'Internal server error' });
  // }
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

//Function to check if user is valid/exists in the system
async function checkUser(emailIn, passwordIn) {
  db = await connection();
  let result = db.collection("users").findOne({email:emailIn, password:passwordIn}); 
  return result;
}

//Function to check if email is valid/exists in the system
async function checkEmail(emailIn) {
  db = await connection();
  let result = db.collection("users").findOne({email:emailIn}); 
  return result;
}

//Function to insert a user document
async function addUser(userData) {
  db = await connection();
  let status = await db.collection("users").insertOne(userData);
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