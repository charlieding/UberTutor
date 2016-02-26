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

//Charles' User Id facebook:1129363767081285