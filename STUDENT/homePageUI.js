      $(function() {

      });
      $(function () {
        /* BOOTSTRAP SLIDER */
        var durationSlider = $("#durationSlider").slider();
        $("#durationSlider").on("slide", function(slideEvt) {
          $("#duration").text(parseInt(slideEvt.value)*.5).trigger('change');
          console.log(slideEvt.value);
        });
        $( "#durationDiv" ).click(function() {
          $("#duration").text(parseInt($("#durationSlider").slider('getValue'))*.5).trigger('change');
        });
        
        $("#flexibilitySlider").slider();
        $("#flexibilitySlider").on("slide", function(slideEvt) {
          if(parseInt(slideEvt.value)){
            $("#flexibility").text(parseInt(slideEvt.value)-5);
          }
        });
        $( "#flexibilitySliderDiv" ).click(function() {
          var value = parseInt($("#flexibilitySlider").slider('getValue'));
          if(value < 5){
            value = 5;
          }
          $("#flexibility").text(value-5);
        });

        /*Initialize Select2 Elements - When something is added, refresh tutors*/
        $(".select2").select2();
        $("#select2ClassSelection").select2().change(function(){
          findTutors();
        });

        //Timepicker
        $("#tutorTime").val(moment().add(10, 'minutes').format("hh:mm A"));
        $(".timepicker").timepicker({
          showInputs: false,
          timePickerIncrement: 5,
        });
        //Single Date Selector
        $('input[name="birthdate"]').val(moment().format("MM/DD/YYYY"));
        $('input[name="birthdate"]').daterangepicker({
          startDate: moment(),
          minDate: moment(),
          endDate: moment(),
          singleDatePicker: true,
          showDropdowns: true
        }, 
        function(start, end, label) {
          var years = moment().diff(start, 'years');
          //alert("You are " + years + " years old.");
        });
      });

      $( document ).ready(function() {
        init();
      });
      function init(){
        $( window ).resize(function() {
          fixMapSize();
          fixSideBars();
        });
        $('#righttabcontent').slimScroll({
          height: 'auto',
          railVisible: true,
          alwaysVisible: true,
          color:"#000000",
          railColor:"#ffffff"
        });
        fixMapSize();
        fixSideBars();
      }

      function fixMapSize(){
        $('#googleMap').height($('#mainleftsidebar').height());
      }
      function fixSideBars(){
        //USES THESE VARIABLES DEFINED IN INDEX.HTML GLOBALLY EG: rightsidebaraside
        $('#righttabcontent').parent().height('auto');

        /* Bottom Menu And Right Side Bar*/
        if($(window).width() <= 767){
          $('#paddingTop').height($(window).height()-280);
          $('#rightsidebaraside').height(($(window).height()-(rightsidebaraside+55)));
          $('#righttabcontent').height($(window).height()-(righttabcontent+55));
        }else{
          $('#paddingTop').height($(window).height()-230);
          $('#rightsidebaraside').height(($(window).height()-rightsidebaraside));
          $('#righttabcontent').height($(window).height()-righttabcontent);
        }
        /*Bug where Screen initailly has tall white spaces*/
        $('#globalwrapper').height($(window).height());
      }