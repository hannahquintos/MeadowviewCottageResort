//import required modules
const express = require("express"); 
const cors = require("cors"); //need this to set this API to allow requests from other servers
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const openweathermap = require("./openweathermap");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dotenv.config();


//DB values
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/`;
const client = new MongoClient(dbUrl);

//set up Express object and port
const app = express();
const port = process.env.PORT || "3000";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


//allow requests from all servers
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

/*
 * to verify jwt
 */

  const verifyJWT = (request, response, next) => {

  try{
    const token = request.cookies.jwt;
    // console.log("token: " + token);
    if (!token) {
      return response.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("decoded token: " + decoded);
    // request.email = decoded.User.email;
    // request.role = decoded.User.role;
    next();

  } catch(e){
    return response.json(e);
  }

  };


//API endpoints

/*
 * retrieve values from the login form
 */
app.post("/api/login", async (request, response) => {
  const{email, password}=request.body;

  //return error code if email or password are missing
  if (!email || !password){
    return response.status(400).json({ message: "All fields are required" });
  }

  //call function to check if user exists in the database
  const user = await findUser(email);
  //return error code if user's email isn't found in the database
  if(!user){
    return response.status(401).json({ message:"Unauthorized" });
  }

  //check if given password matches the user's password in the database
  const validPassword = await bcrypt.compare(password, user.password);
  //return error code if password is invalid
  if(!validPassword){
    return response.status(401).json({ message: "Unauthorized" });
  }

  //create access token
  const accessToken = jwt.sign(
    {
      //save user's information in the access token
      "User": {
        "email": user.email,
        "role": user.role
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  //create cookie
  response.cookie('jwt', accessToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: 'None', //cross-site cookie (to allow api and app to be hosted on different servers)
    maxAge: 360000 //cookie expiry
  });
  
  response.json({ status: "Success", accessToken, role: user.role, userId: user._id });

});

/*
 * logout user
 */

app.get("/api/logout", async (request, response) => {
  const cookies = request.cookies;

  //send status code 204 (no content) if no cookies
  if (!cookies?.jwt){
    return response.sendStatus(204);
  }
  response.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true
  })
  response.json("Cookie cleared");
});

/*
 * retrieve email and login values from the login form
 */
app.post("/api/signup", async (request, response) => {
  const{email, password, firstName, lastName, phone}=request.body;
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = {
    email: email,
    password: hashPassword,
    firstName: firstName,
    lastName: lastName,
    phone: phone
  };

  try{
    const validEmail = await findUser(email);
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
    console.log("An error occurred");
  }

});

/*
 * returns: json object of selected user
 */
app.get("/api/users/:id", async (request, response) => {
  let userId = request.params.id;
  let user = await getSingleUser(userId);
  response.json(user);
});

// retrieve values from submitted edit user POST form
app.post("/api/users/update/:id", async (request, response) => {
  let id = request.params.id;
  // console.log("Id: " + id);
  let idFilter = {_id: new ObjectId(String(id))};
  let firstName = request.body.firstName;
  let lastName = request.body.lastName;
  let email = request.body.email;
  let phone = request.body.phone;
  let user = {
    "firstName": firstName,
    "lastName": lastName,
    "email": email,
    "phone": phone,
  };

  try {
    await editUser(idFilter, user);
    response.json("User successfully updated");
  } catch (e) {
    console.log("An error occurred");
    response.status.json(e);
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

// retrieve values from submitted create event POST form
app.post("/api/events/create", async (request, response) => {
  let eventName = request.body.eventName;
  let startTime = request.body.startTime;
  let endTime = request.body.endTime;
  let location = request.body.location;
  let image = request.body.image;
  let description = request.body.description;

  let newEvent = {
    eventName: eventName,
    startTime: startTime,
    endTime: endTime,
    location: location,
    image: image,
    description: description
  };

  try {
    await addEvent(newEvent);
    response.json("Event successfully created");
  } catch (e) {
    console.log("An error occurred");
    response.status.json(e);
  }
});

// retrieve values from submitted edit event POST form
app.post("/api/events/update/:id", async (request, response) => {
  let id = request.params.id;
  // console.log("Id: " + id);
  let idFilter = {_id: new ObjectId(String(id))};
  let eventName = request.body.eventName;
  let startTime = request.body.startTime;
  let endTime = request.body.endTime;
  let location = request.body.location;
  let image = request.body.image;
  let description = request.body.description;
  let event = {
    "eventName": eventName,
    "startTime": startTime,
    "endTime": endTime,
    "location": location,
    "image": image,
    "description": description
  };

  try {
    await editEvent(idFilter, event);
    response.json("Event successfully updated");
  } catch (e) {
    console.log("An error occurred");
    response.status.json(e);
  }
});

// get activity to delete
app.get("/api/events/delete/:id", async (request, response) => {
  let id = request.params.id;
  
  try {
    await deleteEvent(id);
    response.json("Event successfully deleted");
  } catch (e) {
    console.log("An error occurred");
    response.status.json(e);
  }
});

/*
 * returns: an array of activities
 */
app.get("/api/activities", verifyJWT, async (request, response) => {
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

  try {
    await addActivity(newActivity);
    response.json("Activity successfully created");
  } catch (e) {
    console.log("An error occurred");
    response.status.json(e);
  }
});

// retrieve values from submitted edit activity POST form
app.post("/api/activities/update/:id", async (request, response) => {
  let id = request.params.id;
  // console.log("Id: " + id);
  let idFilter = {_id: new ObjectId(String(id))};
  let activityName = request.body.activityName;
  let startTime = request.body.startTime;
  let endTime = request.body.endTime;
  let location = request.body.location;
  let image = request.body.image;
  let description = request.body.description;
  let activity = {
    "activityName": activityName,
    "startTime": startTime,
    "endTime": endTime,
    "location": location,
    "image": image,
    "description": description
  };

  try {
    await editActivity(idFilter, activity);
    response.json("Activity successfully updated");
  } catch (e) {
    console.log("An error occurred");
    response.status.json(e);
  }
});

// get activity to delete
app.get("/api/activities/delete/:id", async (request, response) => {
  let id = request.params.id;
  
  try {
    await deleteActivity(id);
    response.json("Activity successfully deleted");
  } catch (e) {
    console.log("An error occurred");
    response.status.json(e);
  }
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

// retrieve values from submitted create equipment POST form
app.post("/api/equipment/create", async (request, response) => {
  let equipmentName = request.body.equipmentName;
  let condition = request.body.condition;
  let availability = request.body.availability;
  let image = request.body.image;
  let description = request.body.description;

  let newEquipment = {
    equipmentName: equipmentName,
    condition: condition,
    availability: availability,
    image: image,
    description: description
  };

  try {
    await addEquipment(newEquipment);
    response.json("Equipment successfully created");
  } catch (e) {
    console.log("An error occurred");
    response.status.json(e);
  }
});

// retrieve values from submitted edit equipment POST form
app.post("/api/equipment/update/:id", async (request, response) => {
  let id = request.params.id;
  // console.log("Id: " + id);
  let idFilter = {_id: new ObjectId(String(id))};
  let equipmentName = request.body.equipmentName;
  let condition = request.body.condition;
  let availability = request.body.availability;
  let image = request.body.image;
  let description = request.body.description;
  let equipment = {
    "equipmentName": equipmentName,
    "condition": condition,
    "availability": availability,
    "image": image,
    "description": description
  };

  try {
    await editEquipment(idFilter, equipment);
    response.json("Equipment successfully updated");
  } catch (e) {
    console.log("An error occurred");
    response.status.json(e);
  }
});

// get equipment to delete
app.get("/api/equipment/delete/:id", async (request, response) => {
  let id = request.params.id;
  
  try {
    await deleteEquipment(id);
    response.json("Equipment successfully deleted");
  } catch (e) {
    console.log("An error occurred");
    response.status.json(e);
  }
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

//Function to check if email is valid/exists in the system
async function findUser(emailIn) {
  db = await connection();
  let result = db.collection("users").findOne({email:emailIn}); 
  return result;
}

//Function to insert a user document
async function addUser(userData) {
  db = await connection();
  let status = await db.collection("users").insertOne(userData);
}

//Function to retrieve a single document from users by _id
async function getSingleUser(id){
  db = await connection();
  const userId = { _id: new ObjectId(String(id)) };
  const result = await db.collection("users").findOne(userId); 
  return result;
}

//Function to update a user document
async function editUser(filter, user){
  db = await connection();
  const updateUser = {
    $set: {
      "firstName": user.firstName,
      "lastName": user.lastName,
      "email": user.email,
      "phone": user.phone
    },
  };
  const result = await db.collection("users").updateOne(filter, updateUser);
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

//Function to insert an event document
async function addEvent(eventData) {
  db = await connection();
  let status = await db.collection("events").insertOne(eventData);
}

//Function to update an event document
async function editEvent(filter, event){
  db = await connection();
  const updateEvent = {
    $set: {
      "eventName": event.eventName,
      "startTime": event.startTime,
      "endTime": event.endTime,
      "location": event.location,
      "image": event.image,
      "description": event.description
    },
  };
  const result = await db.collection("events").updateOne(filter, updateEvent);
}

//Function to delete an event document
async function deleteEvent(id) {
  db = await connection();
  const eventDeleteId = { _id: new ObjectId(String(id)) };
  const result = await db.collection("events").deleteOne(eventDeleteId);
  if (result.deletedCount == 1){
    console.log("delete successful");
  }
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

//Function to update an activity document
async function editActivity(filter, activity){
  db = await connection();
  const updateActivity = {
    $set: {
      "activityName": activity.activityName,
      "startTime": activity.startTime,
      "endTime": activity.endTime,
      "location": activity.location,
      "image": activity.image,
      "description": activity.description
    },
  };
  const result = await db.collection("activities").updateOne(filter, updateActivity);
}

//Function to delete an activity document
async function deleteActivity(id) {
  db = await connection();
  const activityDeleteId = { _id: new ObjectId(String(id)) };
  const result = await db.collection("activities").deleteOne(activityDeleteId);
  if (result.deletedCount == 1){
    console.log("delete successful");
  }
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

//Function to insert an equipment document
async function addEquipment(equipmentData) {
  db = await connection();
  let status = await db.collection("equipment").insertOne(equipmentData);
}

//Function to update an equipment document
async function editEquipment(filter, equipment){
  db = await connection();
  const updateEquipment = {
    $set: {
      "equipmentName": equipment.equipmentName,
      "condition": equipment.condition,
      "availability": equipment.availability,
      "image": equipment.image,
      "description": equipment.description
    },
  };
  const result = await db.collection("equipment").updateOne(filter, updateEquipment);
}

//Function to delete an equipment document
async function deleteEquipment(id) {
  db = await connection();
  const equipmentDeleteId = { _id: new ObjectId(String(id)) };
  const result = await db.collection("equipment").deleteOne(equipmentDeleteId);
  if (result.deletedCount == 1){
    console.log("delete successful");
  }
}