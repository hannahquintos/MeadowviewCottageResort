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
  const{email, password, firstName, lastName, phone, role}=request.body;
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = {
    email: email,
    password: hashPassword,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    role: role
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
 * returns: an array of users
 */
app.get("/api/users", async (request, response) => {
  let users = await getAllUsers();
  response.json(users); //send JSON object with appropriate JSON headers
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
  let role = request.body.role;

  let user = {
    "firstName": firstName,
    "lastName": lastName,
    "email": email,
    "phone": phone,
    "role": role
  };

  try {
    await editUser(idFilter, user);
    response.json("User successfully updated");
  } catch (e) {
    console.log("An error occurred");
    response.json(e);
  }
});

// get user to delete
app.get("/api/users/delete/:id", async (request, response) => {
  let id = request.params.id;
  
  try {
    await deleteUser(id);
    response.json("User successfully deleted");
  } catch (e) {
    console.log("An error occurred");
    response.json(e);
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
 * returns: an array of event favourites for a given userId
 */
app.get("/api/eventFavourites/:id", async (request, response) => {
  let userId = request.params.id;
  let eventFavourites = await getAllEventFavourites(userId);
  response.json(eventFavourites); //send JSON object with appropriate JSON headers
});

// retrieve values from submitted add event favourite POST form
app.post("/api/eventFavourites/create", async (request, response) => {
  let eventId = request.body.eventId;
  let userId = request.body.userId;

  let newEventFavourite = {
    eventId: eventId,
    userId: userId
  };

  try {
    await addEventFavourite(newEventFavourite);
    response.json("Event favourite successfully added");
  } catch (e) {
    console.log("An error occurred");
    response.json(e);
  }
});

// get event favourite to delete
app.get("/api/eventFavourites/delete/:id", async (request, response) => {
  let id = request.params.id;
  
  try {
    await deleteEventFavourite(id);
    response.json("Event favourite successfully removed");
  } catch (e) {
    console.log("An error occurred");
    response.json(e);
  }
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
    response.json(e);
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
    response.json(e);
  }
});

// get event to delete
app.get("/api/events/delete/:id", async (request, response) => {
  let id = request.params.id;
  
  try {
    await deleteEvent(id);
    response.json("Event successfully deleted");
  } catch (e) {
    console.log("An error occurred");
    response.json(e);
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

/*
 * returns: an array of activity registrations for a given userId
 */
app.get("/api/activityRegistrations/:id", async (request, response) => {
  let userId = request.params.id;
  let activityRegistrations = await getAllActivityRegistrations(userId);
  response.json(activityRegistrations); //send JSON object with appropriate JSON headers
});

// retrieve values from submitted create activity registration POST form
app.post("/api/activityRegistrations/create", async (request, response) => {
  let activityId = request.body.activityId;
  let userId = request.body.userId;
  let participants = request.body.participants;

  let newActivityRegistration = {
    activityId: activityId,
    userId: userId,
    participants: participants
  };

  try {
    await addActivityRegistration(newActivityRegistration);
    response.json("Activity registration successfully created");
  } catch (e) {
    console.log("An error occurred");
    response.json(e);
  }
});

// get activity registration to delete
app.get("/api/activityRegistrations/delete/:id", async (request, response) => {
  let id = request.params.id;
  
  try {
    await deleteActivityRegistration(id);
    response.json("Activity registration successfully deleted");
  } catch (e) {
    console.log("An error occurred");
    response.json(e);
  }
});

/*
 * returns: json object of selected activity registration
 */
app.get("/api/activityRegistrations/details/:id", async (request, response) => {
  let activityRegistrationId = request.params.id;
  let activityRegistration = await getSingleActivityRegistration(activityRegistrationId);
  response.json(activityRegistration);
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
    response.json(e);
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
    response.json(e);
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
    response.json(e);
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

/*
 * returns: an array of equipment bookings for a given userId
 */
app.get("/api/equipmentBookings/:id", async (request, response) => {
  let userId = request.params.id;
  let equipmentBookings = await getAllEquipmentBookings(userId);
  response.json(equipmentBookings); //send JSON object with appropriate JSON headers
});

// retrieve values from submitted create equipment booking POST form
app.post("/api/equipmentBookings/create", async (request, response) => {

  let equipmentId = request.body.equipmentId;
  let userId = request.body.userId;

  let idFilter = {_id: new ObjectId(String(equipmentId))};

  let newEquipmentBooking = {
    equipmentId: equipmentId,
    userId: userId
  };

  try {
    await addEquipmentBooking(idFilter, newEquipmentBooking);
    response.json("Equipment booking successfully created");
  } catch (e) {
    console.log("An error occurred");
    response.json(e);
  }
});

// get equipment booking to delete
app.get("/api/equipmentBookings/delete/:id", async (request, response) => {
  let id = request.params.id;
  
  try {
    await deleteEquipmentBooking(id);
    response.json("Equipment booking successfully deleted");
  } catch (e) {
    console.log("An error occurred");
    response.json(e);
  }
});

/*
 * returns: json object of selected equipment booking
 */
app.get("/api/equipmentBookings/details/:id", async (request, response) => {
  let equipmentBookingId = request.params.id;
  let equipmentBooking = await getSingleEquipmentBooking(equipmentBookingId);
  response.json(equipmentBooking);
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
    response.json(e);
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
    response.json(e);
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
    response.json(e);
  }
});

/*
 * returns: an array of users
 */
app.get("/api/users", async (request, response) => {
  let equipment = await getAllUsers();
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
      "phone": user.phone,
      "role": user.role
    },
  };
  const result = await db.collection("users").updateOne(filter, updateUser);
}

//Function to select all documents in the users collection
async function getAllUsers() {
  db = await connection();
  let results = db.collection("users").find({});
  let res = await results.toArray();
  return res;
}

//Function to delete a user document
async function deleteUser(id) {
  db = await connection();
  const userDeleteId = { _id: new ObjectId(String(id)) };
  const result = await db.collection("users").deleteOne(userDeleteId);
  if (result.deletedCount == 1){
    console.log("delete successful");
  }
}

//Function to select all documents in the events collection
async function getAllEvents() {
  db = await connection();
  let results = db.collection("events").find({});
  let res = await results.toArray();
  return res;
}

//Function to select all documents in the eventFavourites collection for a given userId
async function getAllEventFavourites(userId) {
  db = await connection();
  const results = db.collection("eventFavourites").find({ userId: userId });  
  let res = await results.toArray();
  return res;
}

//Function to insert an eventFavourites document
async function addEventFavourite(eventFavouriteData) {
  db = await connection();
  let status = await db.collection("eventFavourites").insertOne(eventFavouriteData);
}

//Function to delete an eventFavourite document
async function deleteEventFavourite(id) {
  db = await connection();
  const eventFavouriteDeleteId = { _id: new ObjectId(String(id)) };
  const result = await db.collection("eventFavourites").deleteOne(eventFavouriteDeleteId);
  if (result.deletedCount == 1){
    console.log("delete successful");
  }
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

//Function to select all documents in the activityRegistrations collection for a given userId
async function getAllActivityRegistrations(userId) {
  db = await connection();
  const results = db.collection("activityRegistrations").find({ userId: userId });  
  let res = await results.toArray();
  return res;
}

//Function to insert an activity registration document
async function addActivityRegistration(activityRegistrationData) {
  db = await connection();
  let status = await db.collection("activityRegistrations").insertOne(activityRegistrationData);
}

//Function to delete an activityRegistration document
async function deleteActivityRegistration(id) {
  db = await connection();
  const activityRegistrationDeleteId = { _id: new ObjectId(String(id)) };
  const result = await db.collection("activityRegistrations").deleteOne(activityRegistrationDeleteId);
  if (result.deletedCount == 1){
    console.log("delete successful");
  }
}

//Function to retrieve a single document from activityRegistrations by _id
async function getSingleActivityRegistration(id){
  db = await connection();
  const activityRegistrationId = { _id: new ObjectId(String(id)) };
  const result = await db.collection("activityRegistrations").findOne(activityRegistrationId); 
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

//Function to select all documents in the equipmentBookings collection for a given userId
async function getAllEquipmentBookings(userId) {
  db = await connection();
  const results = db.collection("equipmentBookings").find({ userId: userId });  
  let res = await results.toArray();
  return res;
}

//Function to insert an equipmentBooking document
async function addEquipmentBooking(filter, equipmentBookingData) {
  db = await connection();
  let bookingResult = await db.collection("equipmentBookings").insertOne(equipmentBookingData);

  //change the equipment of the booking to be unavailable
  if (bookingResult.acknowledged) {
    const updateEquipment = {
      $set: {
        "availability": "Unavailable"
      },
    };
    const result = await db.collection("equipment").updateOne(filter, updateEquipment);
  }
}


//Function to delete an equipmentBooking document
async function deleteEquipmentBooking(id) {
  db = await connection();
  const equipmentBookingDeleteId = { _id: new ObjectId(String(id)) };
  const booking = await db.collection("equipmentBookings").findOne(equipmentBookingDeleteId);
  const equipmentId =  { _id: new ObjectId(String(booking.equipmentId)) };
  const result = await db.collection("equipmentBookings").deleteOne(equipmentBookingDeleteId);

  if (result.deletedCount == 1){
    //change the equipment of the booking to be available
    const updateEquipment = {
      $set: {
        "availability": "Available"
      },
    };
    const result = await db.collection("equipment").updateOne(equipmentId, updateEquipment);
    console.log("delete successful");
  }
}

//Function to retrieve a single document from equipmentBookings by _id
async function getSingleEquipmentBooking(id){
  db = await connection();
  const equipmentBookingId = { _id: new ObjectId(String(id)) };
  const result = await db.collection("equipmentBookings").findOne(equipmentBookingId); 
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