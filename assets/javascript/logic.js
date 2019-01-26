  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA1ZgGfLQmdbqDJ-ow7mLxZP0pem0XHOJk",
    authDomain: "brendan-rps-multi.firebaseapp.com",
    databaseURL: "https://brendan-rps-multi.firebaseio.com",
    projectId: "brendan-rps-multi",
    storageBucket: "brendan-rps-multi.appspot.com",
    messagingSenderId: "778849431771"
  };
  firebase.initializeApp(config);

  database = firebase.database();

  var userNames;
  var clientUserName;
  var slot1;
  var clientSlot;
  var clientChoice;
  var clientPlaying;

  //function that will grab usernames from database
  database.ref().on("value",function(snapshot){
      //grabs all the usernames as an array
      userNames = snapshot.val().userNames;

  })

  //function that grabs player-1 values from the database
  database.ref("/player-1").on("value", function(snapshot){
        //grabs the status of slot 1
        slot1 = snapshot.val().active;
        console.log(slot1);
  })

  //function that allows user to choose a user name
  var setUserName = function(name){
    //if the username is not already taken
    if (!userNames.includes(name)){
        console.log("creating a user name");
        //set the client's username to the passed value
        clientUserName = name;
        //add the client's username to the userNames array
        userNames.push(clientUserName);
        //update the usernames array in the databse
        database.ref("userNames").set(userNames);
    }
  }

  //function that allows user to take player-1 slot
  var occupySlot1 = function(){
    //The user is currently playing
    clientPlaying = true;
    clientSlot = 1;
    //update the values in the database
    database.ref("/player-1").set({
        active: true, 
        userName: clientUserName
    })
  }

  //function that removes player from player-1 slot
  var leaveSlot1 = function(){
      //The user is no longer playing
      clientPlaying = false;
      database.ref("/player-1").set({
        active: false, 
        userName: ""
    })
  }

  //function that allows client to select a choice
  var clientSelection = function(choice){
      clientChoice = choice;
  }

  //function that locks in client choice and sends it to database based on the client's slot
  var sumbitChoice = function(){
        database.ref("/player-" + clientSlot + "/choice").set(clientChoice);
  }

