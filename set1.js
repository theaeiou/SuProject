var uid = sessionStorage.uid;
var nid = sessionStorage.nid;
console.log("n:"+nid);
console.log("u:"+uid);
var fbref = firebase.database().ref("User/"+uid);
fbref.once("value").then(function(snapshot) {
  var lp_car = snapshot.child("car_info/lp_car").val();
  //sessionStorage.nid = snapshot.child("rent_id").val();
  var nameE = snapshot.child("name").val();
  var lp_car = snapshot.child("car_info/lp_car").val();
  var email = snapshot.child("email").val();
  var photoURL = snapshot.child("photoURL").val();
  $('#nameE').html("ผู้ใช้:"+nameE);
  $('#lpE').html("ทะเบียนเดิม: "+lp_car);
  $('#mail').html("E-mail: "+email);
  $('#test').html("<img class='rounded' src="+photoURL+" style='width:30%;margin-left: 30px;'> ");
  $('#profile').html("<img class='profile' src="+photoURL+" style='height: 40px;font-size:50%;'><br>: "+nameE);
 });
firebase.database().ref("User/"+uid).on('value',snap =>{
  var pid = snap.child("rent_id").val();
  sessionStorage.nid = pid;
  $('#num').html(pid);
  //check
  if (sessionStorage.nid  == "none") {
    window.location.href="index2.html";
    }
  });
firebase.database().ref("User/"+uid+"/history").limitToLast(1).on('child_added',function(snap){
  sessionStorage.his=snap.key;
  console.log("real="+sessionStorage.his);
  });

firebase.database().ref("Sensor/"+sessionStorage.nid).on('value',snap =>{
  var time = snap.child("time").val();
  var full = snap.child("full").val();
  $('#times').html("เหลือเวลาอีก :"+time+" วินาที");
  if (time == 0) {
    swal("หมดเวลา!", "ท่านมาไม่ทันเวลา", "error");
    firebase.database().ref("User/"+uid+"/history/"+sessionStorage.his).update({
      status:"Time-out"
    });
  }
  else if (full == true) {
    swal("มาถึงแล้ว!", "ท่านมาถึงยังที่จอดแล้ว", "success");
    firebase.database().ref("User/"+uid+"/history/"+sessionStorage.his).update({
      status:"Arrived"
    });
  }
});

function cancel(){
  var firebaseRef = firebase.database();
  firebaseRef.ref("Sensor/"+nid).update({ //ส่งข้อมูล
    rent:false, //status==full
    rent_info:{
      lp_car:" ",
      name:" ",
      uid:" "
    },
    time:30
  });
  firebaseRef.ref("User/"+uid).update({
    rent_id:"none"
  });
  firebaseRef.ref("User/"+uid+"/history/"+sessionStorage.his).update({
    status:"Cancel"
  });

}

function Logout() {
  firebase.auth().signOut().then(function(){
    console.log('signOut');
    }).catch(function(error) {
    console.log('Failed');
  });
  sessionStorage.clear();
  window.location.href="index1.html";
}
