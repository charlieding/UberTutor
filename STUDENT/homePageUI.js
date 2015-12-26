      $(function() {

      });
      $(function () {
        /* BOOTSTRAP SLIDER */
        $("#ex6").slider();
        $("#ex6").on("slide", function(slideEvt) {
          $("#ex6SliderVal").text(slideEvt.value);
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
        fixMapSize();
        fixSideBars();
        $( window ).resize(function() {
          fixMapSize();
          fixSideBars();
        });
        $('#righttabcontent').slimScroll({
          height: 'auto'
        });
      }

      function fixMapSize(){
        $('#googleMap').height($('#mainleftsidebar').height());
      }
      function fixSideBars(){
        $('#righttabcontent').parent().height('auto');
        $('#rightsidebaraside').height(($(window).height()-100));
        $('#righttabcontent').height($(window).height()-100);
        /* Bottom Menu */
        if($(window).width() <= 767){
          $('#paddingTop').height($(window).height()-330);
        }else{
          $('#paddingTop').height($(window).height()-280);
        }
        /*Bug where Screen initailly has tall white spaces*/
        $('#globalwrapper').height($(window).height());
      }