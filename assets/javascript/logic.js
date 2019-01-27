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
var slot2;
var clientSlot =0;
var clientChoice;
var clientPlaying =false;
var player1Name;
var player2Name;
var player1Choice;
var player2Choice;
var player1Score= {wins: 0, losses: 0, ties: 0};
var player2Score= {wins: 0, losses: 0, ties: 0}

//function that will grab usernames from database
database.ref().on("value", function (snapshot) {
    //grabs all the usernames as an array
    userNames = snapshot.val().userNames;
})

//function that grabs player-1 values from the database
database.ref("/player-1").on("value", function (snapshot) {
    //grabs the status of slot 1
    slot1 = snapshot.val().active;

    //if the slot is already taken, the occupy slot function cannot be called
    if (slot1){
        $("#slot-1-join").attr("disabled","disabled");
    }
    else{
        $("#slot-1-join").removeAttr("disabled");
    }
    //the player can only call the leave slot if they are playing
    if(clientPlaying && clientSlot === 1){
        $("#slot-1-leave").removeAttr("disabled");
    }
    else{
        $("#slot-1-leave").attr("disabled","disabled");
    }
    console.log(player1Choice);
    console.log(slot1);
    //grab player1's username from database and add it dom
    player1Name = snapshot.val().userName;
    $("#player-1-name").text(player1Name);

    if (snapshot.child("choice").exists()){
        player1Choice = snapshot.val().choice;
        console.log(player1Choice);
    }
});
database.ref("/player-2").on("value", function (snapshot) {
    //grabs the status of slot 1
    slot2 = snapshot.val().active;
    if (slot2){
        $("#slot-2-join").attr("disabled","disabled");
    }
    else{
        $("#slot-2-join").removeAttr("disabled");
    }
    //the player can only call the leave slot function if they are playing
    if(clientPlaying && clientSlot === 2){
        $("#slot-2-leave").removeAttr("disabled");
    }
    else{
        $("#slot-2-leave").attr("disabled","disabled");
    }
    console.log(player2Choice);
    console.log(slot2);
    //grab player2's username from database and add it dom
    player2Name = snapshot.val().userName;
    $("#player-2-name").text(player2Name);

    if (snapshot.child("choice").exists()){
        player2Choice = snapshot.val().choice;
        console.log(player2Choice);
    }
});
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");
// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {
    console.log("snapval():",snap.val());
  // If they are connected..
  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef.push([true, clientSlot]);
    console.log("connections",con);
    // console.log(firebase.ref())
    // console.log(database.ref("/connections").once("value"));
    console.log("snapval20():",snap.val());
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().set([false,clientSlot]);
  };
});

//function that allows user to choose a user name
var setUserName = function (name) {
    //if the username is not already taken
    if (!userNames.includes(name)) {
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
var occupySlot1 = function () {
    //The user is currently playing
    clientPlaying = true;
    clientSlot = 1;
    //update the values in the database
    database.ref("/player-1").set({
        active: true,
        userName: clientUserName
    })
    connectionsRef.set([true,clientSlot]);
}

//function that removes player from player-1 slot
var leaveSlot1 = function () {
    //The user is no longer playing
    clientPlaying = false;
    clientSlot = 0;
    database.ref("/player-1").set({
        active: false,
        userName: ""
    })
}
//function that allows user to take player-1 slot
var occupySlot2 = function () {
    //The user is currently playing
    clientPlaying = true;
    clientSlot = 2;
    //update the values in the database
    database.ref("/player-2").set({
        active: true,
        userName: clientUserName
    })
}

//function that removes player from player-1 slot
var leaveSlot2 = function () {
    //The user is no longer playing
    clientPlaying = false;
    clientSlot = 0;
    database.ref("/player-2").set({
        active: false,
        userName: ""
    })
}

//function that allows client to select a choice
var clientSelection = function (choice) {
    clientChoice = choice;
}

//function that locks in client choice and sends it to database based on the client's slot
var sumbitChoice = function () {
    database.ref("/player-" + clientSlot + "/choice").set(clientChoice);
    compare();
}

//function that compares the choices of the two players
var compare = function () {
    //if both players have submitted a choice
    if(player1Choice != undefined && player2Choice != undefined){
        console.log("making a comparison");
        //the users tied
        if(player1Choice === player2Choice){
            player1Score.ties++;
            database.ref("/player-1/ties").set(player1Score.ties);
            player2Score.ties++;
            database.ref("/player-2/ties").set(player2Score.ties);
        }
        //player1 wins
        else if((player1Choice === "r" && player2Choice === "s")||
        (player1Choice === "p" && player2Choice === "r")||
        (player1Choice === "s" && player2Choice === "p")){
            player1Score.wins++;
            database.ref("/player-1/wins").set(player1Score.wins);
            player2Score.losses++;
            database.ref("/player-2/losses").set(player2Score.losses);
        }
        //player2 wins
        else{
            player1Score.losses++;
            database.ref("/player-1/losses").set(player1Score.losses);
            player2Score.wins++;
            database.ref("/player-2/wins").set(player2Score.wins);
        }
        //resetting the player choices
        database.ref().child("player-1").child("choice").remove();
        database.ref().child("player-2").child("choice").remove();
        player1Choice = undefined
        player2Choice = undefined
    }
}

$(document).on("click","#submit-user-name",function(event){
    event.preventDefault();
    setUserName($("#user-name").val().trim());
    $("#user-name").val("");
});
$(document).on("click","#slot-1-join", function(){
    occupySlot1();
});
$(document).on("click","#slot-1-leave", function(){
    leaveSlot1();
});
$(document).on("click","#slot-2-join", function(){
    occupySlot2();
});
$(document).on("click","#slot-2-leave", function(){
    leaveSlot2();
});
$(document).on("click",".choice",function(){
    clientSelection($(this).attr("data-choice"));
})
$(document).on("click","#submit-choice",function(){
    sumbitChoice();
})
