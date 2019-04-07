var uid = sessionStorage.uid;
var fbref = firebase.database().ref("User/"+uid);
fbref.once("value").then(function(snapshot) {
  sessionStorage.lp_car = snapshot.child("car_info/lp_car").val();
  //sessionStorage.nid = snapshot.child("rent_id").val();
  var nameE = snapshot.child("name").val();
  sessionStorage.name = nameE;
  var photoURL = snapshot.child("photoURL").val();
  $('#nameE').html("ผู้ใช้:"+nameE);
  //$('#namee').html("ผู้ใช้:<br>"+nameE);

  $('#test').html("<img class='rounded' src="+photoURL+" style='width:30%;margin-left: 30px;'> ");

  //console.log("sssssssssss"+photoURL);
});

   console.log("name="+sessionStorage.name);
  // console.log(sessionStorage.email);
  firebase.database().ref("User/"+uid).on('value',snap =>{
    sessionStorage.nid = snap.child("rent_id").val();
    var photoURL = snap.child("photoURL").val();
    var nameE = snap.child("name").val();
    var lp_car = snap.child("car_info/lp_car").val();
    var email = snap.child("email").val();
    $('#lpE').html("ทะเบียนเดิม: "+lp_car);
    $('#mail').html("E-mail: "+email);
    $('#profile').html("<img class='profile' src="+photoURL+" style='height: 60px;'><br>: "+nameE);
//check ว่า user ได้จองไว้หรอไม่
    if (sessionStorage.nid == "none") {
    showData(sessionStorage.uid);
    Parker();
    console.log(sessionStorage.uid);
    }
    else {

      window.location.href="index3.html";
    }
    });
  console.log("user rent:"+sessionStorage.nid);
  console.log("uid:"+uid);
  // console.log(sessionStorage.lp_car);
  // console.log(sessionStorage.name);

  //--------------------------CONSOLE
function showData(uid){
  var firebaseRef = firebase.database().ref("User/"+uid+"");
  firebaseRef.once('value').then(function(dataSnapshot) {
    dataSnapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      console.log("UserData = ",childData);
    });
  });
}

//------------------------ switching Parking img
function Parker(){
var database = firebase.database();
database.ref("Sensor/A1").on('value',snap =>{
  var rent = snap.child("rent").val();
  var full = snap.child("full").val();
  console.log("rent = ",rent);
  console.log("full = ",full);
  if (rent==true||full==true) { //status==full||busy==true
    $('#A1').attr("src", "no_parking.png");
  }
  else {
    //sessionStorage.p1 = "No_1";
    $('#A1').attr("src", "parking.png");
    $('#A1_a').attr("data-toggle", "modal");
    $('#A1_a').attr("data-target", "#exampleModal");
    $('#A1_a').attr("onclick", "sessionStorage.nid='A1'");
    }
  });
  //------Sensor2
  database.ref("Sensor/C4").on('value',snap =>{
    var rent = snap.child("rent").val();
    var full = snap.child("full").val();
    console.log("rent = ",rent);
    console.log("full = ",full);
    if (rent==true||full==true) { //status==full||busy==true
      $('#C4').attr("src", "no_parking.png");
    }
    else {
      $('#C4').attr("src", "parking.png");
      $('#C4_a').attr("data-toggle", "modal");
      $('#C4_a').attr("data-target", "#exampleModal");
      $('#C4_a').attr("onclick", "sessionStorage.nid='C4'");
      }
    });

}

function Rent(){

var firebaseRef = firebase.database();
firebaseRef.ref("Sensor/"+sessionStorage.nid).update({ //ส่งข้อมูล
  rent:true, //status==full
  rent_info:{
    lp_car:sessionStorage.lp_car,
    name:sessionStorage.name,
    uid:sessionStorage.uid
  }
});
firebaseRef.ref("User/"+sessionStorage.uid).update({
  rent_id:sessionStorage.nid
});
//history()
var date = new Date();
var day = date.getDate().toString();
var month = date.getMonth();
var months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
 "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
var year = (date.getFullYear()+543).toString();
var hour = date.getHours().toString();
var min = date.getMinutes().toString();
var sec = date.getSeconds().toString();
if (hour.length==1) {  hour = "0"+hour;}
if (min.length==1) {  min = "0"+min;}
if (sec.length==1) {  sec = "0"+sec;}
var currentDate = day+" "+months[month]+" "+year;
var currentTime = hour+":"+min+":"+sec;
sessionStorage.date = currentDate;
sessionStorage.time = currentTime;
firebaseRef.ref("User/"+sessionStorage.uid+"/history").push({
  date:currentDate,
  time:currentTime,
  parking:sessionStorage.nid,
  status:"Booking"
});
firebaseRef.ref("User/"+sessionStorage.uid+"/history").limitToLast(1).on('child_added',function(snap){
  sessionStorage.his=snap.key
});
console.log("Great!");

document.getElementById("alert").style.display = "block";
//window.location.href="index3.html";
//
}

function check() {
  var lp = document.getElementById('lp_car').value;
    var userRef = firebase.database().ref("LP_CAR");
    userRef.child(lp).once('value').then(function(snap){
      console.log("user ",snap.val());
      console.log("user ",snap.key);
      if (snap.val()==null){
        $('#noti').html('<p style="color:green";> '+lp+' สามารถใช้ได้</p>');
        document.getElementById("Esend").disabled = false;
      }
      else {
        document.getElementById("Esend").disabled = true;
        $('#noti').html('<p style="color:red";> '+lp+' มีผู้ใช้แล้ว</p>');
        console.log("Already use");
      }
    });
}
//--------Edit
function saveOnClick(){
  var lp = document.getElementById('lp_car');
  var check = document.getElementById('lp_car').value;
  if (check.length<2||check.length>=8) {
    alert("กรุณากรอกเลขทะเบียนให้ถูกต้อง");
    return;
  }
  else {
    insertLP(lp.value,sessionStorage.uid);
    }
}

function insertLP(lp,uid){
  var firebaseRef = firebase.database().ref("User/"+uid+"/car_info");
  firebaseRef.update({ //ส่งข้อมูล
      lp_car:lp
  });
  var firebaseRef = firebase.database().ref("LP_CAR").child(lp);
  firebaseRef.update({ //ส่งข้อมูล
      name:sessionStorage.name
  });
  document.getElementById('e_from').style.display= 'none';
  console.log("Success");
}

function A1(){
  $('#mlp').html("<a style='color:#9ce2f7;font-weight: bold;'>A1</a>");
}
function C4(){
  $('#mlp').html("<a style='color:#9ce2f7;font-weight: bold;'>C4</a>");
}
function edit(){
  document.getElementById('e_from').style.display= 'block';
}

function Logout() {
  firebase.auth().signOut().then(function(){
    console.log('signOut');
    }).catch(function(error) {
    console.log('Failed');
  });
  sessionStorage.clear();
  // sessionStorage.nid.clear();
  // sessionStorage.name.clear();
  // sessionStorage.lp_car.clear();
  window.location.href="index1.html";
}
