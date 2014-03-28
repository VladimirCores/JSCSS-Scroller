(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());    
     
 (function(){
     
    var scrollviewcontent = document.getElementById("scroller-content");
    var scrollview = document.getElementById("scroller");
    var trace = $("#trace"); 
     
    var scrollrange = $(scrollviewcontent).height() + $("#header").height() + $("#content").height();
    
    var bounceheight = 200.0;
    var animationtimestep = 1/20.0;
    var mousedownpoint = null;
    var translatedmousedownpoint = null;
    var currentmousepoint = null;
    var animationtimer = null;
    var velocity = 0;
    var position = 0;
    var returntobaseconst = 1.5;
    var decelerationconst = 100;
    var bouncedecelerationconst = 1500.0;

     console.log(scrollrange);
       
     
    function scrollviewdown(point) {
        console.log("scrollviewdown", point);
        if ( animationtimer ) stopanimation();
        mousedownpoint = point;
        translatedmousedownpoint = mousedownpoint;
        currentmousepoint = mousedownpoint;
        //globalID = requestAnimationFrame(updatescrollview);
        animationtimer = setInterval(function(){
            updatescrollview();
        }, animationtimestep);
    }

    function scrollviewup() {
        mousedownpoint = null;
        currentmousepoint = null;
        translatedmousedownpoint = null;
    }

    function scrollviewmove(point) {
        if ( !mousedownpoint ) return;
        currentmousepoint = point;
    }

    function updatescrollview() {
        var oldvelocity = velocity;

        // If mouse is still down, just scroll instantly to point
        if ( mousedownpoint ) {
            trace.text(Math.round(position) + " - " + velocity);
            // First assume not beyond limits
            var displacement = currentmousepoint - translatedmousedownpoint;
            velocity = displacement / animationtimestep;
            translatedmousedownpoint = currentmousepoint;

            // If scrolled beyond top or bottom, dampen velocity to prevent going 
            // beyond bounce height
            if ( (position > 0 && velocity > 0) || ( position < -1 * scrollrange && velocity < 0) ) {
                var displace = ( position > 0 ? position : position + scrollrange );
                velocity *= (1.0 - Math.abs(displace) / bounceheight);
            }
        }
        else {
            trace.text(Math.round(position) + " - " + velocity);
            if ( position > 0 ) {
                // If reach the top bound, bounce back
                if ( velocity <= 0 ) {
                    // Return to 0 position
                    velocity = -1 * returntobaseconst * Math.abs(position);
                }
                else {
                    // Slow down in order to turn around
                    var change = bouncedecelerationconst * animationtimestep;
                    velocity -= change;
                }
            }
            else if ( position < -1 * scrollrange ) {
                // If reach bottom bound, bounce back
                if ( velocity >= 0 ) {
                    // Return to bottom position
                    velocity = returntobaseconst * Math.abs(position + scrollrange);
                }
                else {
                    // Slow down
                    var change = bouncedecelerationconst * animationtimestep;
                    velocity += change;
                }
            }
            else {
                // Free scrolling. Decelerate gradually.
                var changevelocity = decelerationconst * animationtimestep;
                if ( changevelocity > Math.abs(velocity) ) {
                    velocity = 0;
                    stopanimation();
                }
                else {
                    velocity -= (velocity > 0 ? +1 : -1) * changevelocity;
                }
            }
        }

        // Update position
        position += velocity * animationtimestep;

        // Update view
        
        scrollviewcontent.style.webkitTransform = 'translateY(' + Math.round(position) + 'px)';
        //requestAnimationFrame(updatescrollview)
    }

    function stopanimation() {
        clearInterval(animationtimer);
        animationtimer = null;
        velocity = 0;
        //window.cancelAnimationFrame(globalID);
    }
 })