function sendSmsMessage(userId, message){
	console.log("Attempting to send SMS Message to "+ userId);
	if(userId){
		(new Firebase("https://ubertutoralpha.firebaseio.com/users/"+userId+"/phoneNumber")).once('value', function (phoneNumberSnapShot) {
			console.log(phoneNumberSnapShot.val());
			var toPhoneNumber = phoneNumberSnapShot.val().replace(/[^0-9.]/g, "");
			$.post( "http://52.23.157.36/api/v1/SMSMessage", {to: toPhoneNumber,from: "...", message: "AsapTutor: "+message })
		      .done(function( data ) {
		        console.log( "Data Loaded: ", data );
		        console.log(data.success);
		      });
		});
  	}
}
function sendSmsMessagePhoneNumber(phoneNumber, message){
	console.log("Attempting to send SMS Message to "+ phoneNumber);
	if(phoneNumber){
			var toPhoneNumber = phoneNumber.replace(/[^0-9.]/g, "");
			$.post( "http://52.23.157.36/api/v1/SMSMessage", {to: toPhoneNumber,from: "...", message: "AsapTutor: "+message })
		      .done(function( data ) {
		        console.log( "Data Loaded: ", data );
		        console.log(data.success);
		      });
  	}
}
function notifyAppointmentCancellation(appointmentID){
	console.log("Attempting to send SMS Message to both Tutor and Student of AppointmentID:"+ appointmentID);
	if(appointmentID){
		(new Firebase("https://ubertutoralpha.firebaseio.com/appointments/"+appointmentID+"/tutorID")).once('value', function (tutorIDSnapShot) {
			console.log(tutorIDSnapShot.val());
			sendSmsMessage(tutorIDSnapShot.val(), "Your appointment '"+appointmentID+"'' has been CANCELLED.");
		});
		(new Firebase("https://ubertutoralpha.firebaseio.com/appointments/"+appointmentID+"/studentID")).once('value', function (studentIDSnapShot) {
			console.log(studentIDSnapShot.val());
			sendSmsMessage(studentIDSnapShot.val(), "Your appointment '"+appointmentID+"'' has been CANCELLED.");
		});
  	}
}
function sendSmsMessageToTutor(appointmentID, msg){
	console.log("Attempting to send SMS Message to both Tutor and Student of AppointmentID:"+ appointmentID);
	if(appointmentID){
		(new Firebase("https://ubertutoralpha.firebaseio.com/appointments/"+appointmentID+"/tutorID")).once('value', function (tutorIDSnapShot) {
			console.log(tutorIDSnapShot.val());
			sendSmsMessage(tutorIDSnapShot.val(), msg);
		});
  	}
}
function sendSmsMessageToStudent(appointmentID, msg){
	console.log("Attempting to send SMS Message to both Tutor and Student of AppointmentID:"+ appointmentID);
	if(appointmentID){
		(new Firebase("https://ubertutoralpha.firebaseio.com/appointments/"+appointmentID+"/studentID")).once('value', function (studentIDSnapShot) {
			console.log(studentIDSnapShot.val());
			sendSmsMessage(studentIDSnapShot.val(), msg);
		});
  	}
}

//Charles' User Id facebook:1129363767081285

  