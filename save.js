
var provider = new firebase.auth.FacebookAuthProvider();
var provider2 = new firebase.auth.GoogleAuthProvider();
  function FaceLog() {
    firebase.auth().signInWithPopup(provider).then(function(result){
      var token = result.credential.accessToken;
      var user =result.user;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var email=user.email;
      var name = user.displayName;
      document.getElementById('profile').style.display= 'block';
      document.getElementById('name').style.display= 'block';
      $('#profile').html("<img src="+photoURL+" class='rounded' style='width:30%';>");
      $('#name').html(name+"<br>"+email);
      var userRef = firebase.database().ref("User");
      userRef.child(uid).once('value').then(function(snap){
        console.log("user ",snap.val());
        console.log("user ",snap.key);
        console.log("user ",uid);
        if (snap.val()==null){
          car_form(uid);
          console.log("Inserted");
        }
        else {
          console.log("Already");
          go();
        }
      });

      sessionStorage.photoURL=photoURL;
      sessionStorage.name=name;
      sessionStorage.email=email;
      sessionStorage.uid=uid
      // car_form(uid);
      //
      // console.log(name);
      // console.log(uid);
      // console.log(photoURL);
    }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    })
  }//FlogIn
  function GooLog(){
    firebase.auth().signInWithPopup(provider2).then(function(result){
      var token = result.credential.accessToken;
      var user =result.user;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var email=user.email;
      var name = user.displayName;
      document.getElementById('profile').style.display= 'block';
      document.getElementById('name').style.display= 'block';
      $('#profile').html("<img src="+photoURL+" class='rounded' style='width:30%';>");
      $('#name').html(name+"<br>"+email);
      var userRef = firebase.database().ref("User");
      userRef.child(uid).once('value').then(function(snap){
        console.log("user ",snap.val());
        console.log("user ",snap.key);
        console.log("user ",uid);
        if (snap.val()==null){
          car_form(uid);
          console.log("Inserted");
        }
        else {
          console.log("Already");
          go();
        }
      });
      sessionStorage.photoURL=photoURL;
      sessionStorage.name=name;
      sessionStorage.email=email;
      sessionStorage.uid=uid
    }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    });
  }
  function signUp(){
    var email = document.getElementById('mail').value;
    var password = document.getElementById('password').value;
    if (email.length<3) {
      alert("กรุณาป้อนข้อมูลให้ถูกต้อง");
      return;
    }
    if (password.length<3) {
      alert("กรุณาป้อนข้อมูลให้ถูกต้อง");
      return;
    }
    firebase.auth().signInWithEmailAndPassword(email,password).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('Password is too weak.');
      } else {
        alert(errorMessage);
      }
    });
    firebase.auth().onAuthStateChanged(function(user){
      if (user) {
        sessionStorage.email=user.email;
        sessionStorage.uid=user.uid;
        go();
      }
    });
  }

  function register(){
    var email = document.getElementById('rmail').value;
    var password = document.getElementById('rpassword').value;
    var cpassword = document.getElementById('rcpassword').value;
    var lp_car = document.getElementById('lp_car').value;
    var name = document.getElementById('Uname').value;
      if (email.length<3||name.length<1) {
        alert("กรุณาป้อนข้อมูลให้ถูกต้อง");
        return;
      }
      if (password.length<3||password!=cpassword) {
        alert("กรุณาป้อนรหัสผ่านให้ถูกต้อง");
        return;
      }
      if (lp_car.length<2||lp_car.length>=8) {
        alert("กรุณากรอกเลขทะเบียนให้ถูกต้อง");
        return;
      }
    firebase.auth().createUserWithEmailAndPassword(email,password).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode == 'auth/weak-password') {
        alert('Password is too weak.');
      } else {
        alert(errorMessage);
      }
    });
    getuser(lp_car,name);
  }

  function getuser(lp_car,name) {
    firebase.auth().onAuthStateChanged(function(user){
      if (user) {
        var uid = user.uid;
        var email = user.email;
        console.log(uid);
        var userRef = firebase.database().ref("User");
        userRef.child(uid).once('value').then(function(snap){
          if (snap.val()==null){
            var firebaseRef = firebase.database().ref("User/"+uid);
            firebaseRef.set({ //ส่งข้อมูล
              photoURL:"http://www.stickpng.com/assets/images/585e4beacb11b227491c3399.png",
              email:email,
              name:name,
              rent_id:"none",
              car_info:{
                      lp_car:lp_car
                    }
            });
            var firebaseRef = firebase.database().ref("LP_CAR").child(lp_car);
            firebaseRef.update({ //ส่งข้อมูล
                name:name
            });
          }
        });
        sessionStorage.name=name;
        sessionStorage.email=email;
        sessionStorage.uid=uid
      }
    });

  }

  function car_form(uid){
    if (uid != null) {
      document.getElementById('login').style.display= 'none';
      document.getElementById('form').style.display= 'block';
      document.getElementById('header2').style.display= 'none';

    }
  }

  function saveOnClick(){
    var lp_car = document.getElementById('lp');
    var check = document.getElementById('lp').value;
    if (check.length<2||check.length>=8) {
      alert("กรุณากรอกเลขทะเบียนให้ถูกต้อง");
      return;
    }
    else {
      insertLP(lp_car.value,sessionStorage.uid);
      }
  }

  function insertLP(lp_car,uid){
    var firebaseRef = firebase.database().ref("User/"+uid);
    firebaseRef.set({ //ส่งข้อมูล
      photoURL:sessionStorage.photoURL,
      email:sessionStorage.email,
      name:sessionStorage.name,
      rent_id:"none",
      car_info:{
              lp_car:lp_car
            }
    });
    var firebaseRef = firebase.database().ref("LP_CAR").child(lp_car);
    firebaseRef.update({ //ส่งข้อมูล
        name:sessionStorage.name
    });
    console.log("Success");
    window.location.href="index2.html";
  }

  function go(){
    window.location.href="index2.html";
  }

  function check() {
    var lp = document.getElementById('lp').value;
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

  function check2() {
    var lp = document.getElementById('lp_car').value;
      var userRef = firebase.database().ref("LP_CAR");
      userRef.child(lp).once('value').then(function(snap){
        console.log("user ",snap.val());
        console.log("user ",snap.key);
        if (snap.val()==null){
          $('#noti2').html('<p style="color:green";> '+lp+' สามารถใช้ได้</p>');
          document.getElementById("Esend2").disabled = false;
        }
        else {
          document.getElementById("Esend2").disabled = true;
          $('#noti2').html('<p style="color:red";> '+lp+' มีผู้ใช้แล้ว</p>');
          console.log("Already use");
        }
      });
  }

  function FLogOut() {
    firebase.auth().signOut().then(function(){
      console.log('signOut');
      }).catch(function(error) {
      console.log('Failed');
    });
    document.getElementById('profile').style.display= 'none';
    document.getElementById('name').style.display= 'none';
    document.getElementById('form').style.display= 'none';
    document.getElementById('login').style.display= 'block';
  }
