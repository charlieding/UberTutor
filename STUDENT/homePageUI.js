      $(function() {

      });
      $(function () {
        /* BOOTSTRAP SLIDER */
        $("#durationSlider").slider();
        $("#durationSlider").on("slide", function(slideEvt) {
          $("#duration").text(slideEvt.value).trigger('change');
        });
        
        $("#flexibilitySlider").slider();
        $("#flexibilitySlider").on("slide", function(slideEvt) {
          $("#flexibility").text(slideEvt.value);
        });
        /*Initialize Select2 Elements */
        $(".select2").select2();
        //Timepicker
        $("#tutorTime").val(moment().format("hh:mm A"));
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
          alert("You are " + years + " years old.");
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
        //USES THESE VARIABLES DEFINED IN INDEX.HTML GLOBALLY
        $('#righttabcontent').parent().height('auto');
        $('#rightsidebaraside').height(($(window).height()-rightsidebaraside));
        $('#righttabcontent').height($(window).height()-righttabcontent);
        //$('#rightsidebaraside').height(($(window).height()-100));
        //$('#righttabcontent').height($(window).height()-265);
        //$('#righttabcontent').height('auto'); //NOT WORKING - MUST FIX
        /* Bottom Menu */
        if($(window).width() <= 767){
          $('#paddingTop').height($(window).height()-280);
        }else{
          $('#paddingTop').height($(window).height()-230);
        }
        /*Bug where Screen initailly has tall white spaces*/
        $('#globalwrapper').height($(window).height());
      }