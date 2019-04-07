var uid = sessionStorage.uid;
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
console.log(sessionStorage.uid);
var text = "";
text+="<table class='table table-striped table-sm'>";
text+="<thead>";
text+="<tr class='table-primary' align='center'>";
text+="<th scope='col'>วันที่</th>";
text+="<th scope='col'>เวลา</th>";
text+="<th scope='col'>ช่องจอด</th>";
text+="<th scope='col'>การจอง</th>";
text+="</tr>";
text+="</thead>";
text+="<tbody>";
var ref = firebase.database().ref("User/"+uid+'/history');
 ref.on('value',function(dataSnapshot) {
 dataSnapshot.forEach(function(childSnapshot) {
   var data = childSnapshot.val();
   var childData2 = dataSnapshot.val();
   var childData3 = Object.keys(childData2);

   var color = "#ed9a38";
   if (data.status=="Cancel") {
     color = "red"
   }
   else if (data.status=="Arrived") {
     color = "green"
   }
   else if (data.status=="Time-out") {
     color = "gray"
   }
   text+="<tr  align='center'>";
   text+="<td>"+data.date+"</td>";
   text+="<td>"+data.time+"</td>";
   text+="<td>"+data.parking+"</td>";
   text+="<td style='font-weight: bold;color:"+color+";'>"+data.status+"</td>";
   text+="</tr>";
   document.getElementById("his").innerHTML = text;
 });
});

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
