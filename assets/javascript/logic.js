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

  //function that will grab values from the database
  database.ref().on("value",function(snapshot){
      //grabs all the usernames as an array
      userNames = snapshot.val().userNames;
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
  var takeSlot1 = function(){

  }

  //function that removes player from player-1 slot

  //function that allows player-1 to select a choice for the game

  //function that locks in player-1 choice


