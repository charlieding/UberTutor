function sendSmsMessage(to, message){
	var toPhoneNumber = to.replace(/[^0-9.]/g, "")
	$.post( "http://52.23.157.36/api/v1/SMSMessage", {to: toPhoneNumber,from: "...", message: "AsapTutor: "+message })
      .done(function( data ) {
        console.log( "Data Loaded: ", data );
        console.log(data.success);
      });
}