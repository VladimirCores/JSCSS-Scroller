(function (global) {
    app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
        $(document.body).height(window.innerHeight);
        $("#content").height(window.innerHeight - $("#header").height()).css("margin-top", $("#header").height());
        $("#scroller").height($("#content").height());
        
        var scrollviewcontent = document.getElementById("scroller-content");
        var scrollview = document.getElementById("scroller");
        var trace = $("#trace"); 
        
        var scrollrange = -$(scrollviewcontent).height() + $("#header").height() + $("#content").height();

        console.log(scrollrange);
        
        var fps = 60; 
        var fpsinterval = 1000 / fps;
        var globalID;
        
        var startY = 0; 
        var posY = 0;
        var prevPosY = 0;
        var deltaPos = 0;
        var prevTime = 0;
        var time = 0;
        var timeStart = 0;
        var deltaTime = 0;
        var speed = 0;
        var deceleration = 0.96;
        var sign = 0;
        
        var transfromTemplte = ['translateY(', 0, 'px)'];
        var scrollContentStyle = scrollviewcontent.style;
        var doResetInterval = 100;
        var doResetID = null;
        var doReset = false;
        var allowCalculate = true;
        var allowCalculateInterval = 100;
        
        scrollview.addEventListener('touchstart', Handler_Touch_Start);
        scrollview.addEventListener('touchmove', Handler_Touch_Move);
        scrollview.addEventListener('touchend', Handler_Touch_End);
        
         
        function Handler_Touch_Start(event) {
            event.preventDefault();
            var touch = event.targetTouches[0];
            if (touch) {
                reset();
                var curTransform = new WebKitCSSMatrix(window.getComputedStyle(scrollviewcontent).webkitTransform);
                startY = touch.screenY - curTransform.m42;
                timeStart = event.timeStamp
            }
        }
        
        function Handler_Touch_Move(event) {
            event.preventDefault();
            var touch = event.targetTouches[0];
            if (touch) {
                posY = touch.screenY - startY;
                time = event.timeStamp;
                
                if (posY > 0) posY = 0;
                else if (posY < scrollrange) posY = scrollrange;
                
                transfromTemplte[1] = posY;
                scrollContentStyle.webkitTransform = transfromTemplte.join("");
                 
                deltaPos = posY - prevPosY;
                deltaTime = time - prevTime;
                sign = deltaPos > 0 ? -1 : 1;
                speed = Math.abs(deltaPos / deltaTime);
                
                prevTime = time;
                prevPosY = posY;
            }
        }
        
        function Handler_Touch_End(event) {
            event.preventDefault();
            var absspeed = Math.abs(speed);
            if(absspeed > 0.1) {
                if(absspeed > 3) speed = -3 * sign; 
                decelerate();
            }
            trace.text(speed);
        }
        
        function decelerate() {
            globalID = requestAnimationFrame(decelerate);
            if(speed > 0.01 && (posY < 0 && posY > scrollrange)) {
                posY -= speed * 20 * sign;
                speed *= deceleration;
                if (posY > 0)
                    posY = 0;
                else if (posY < scrollrange)
                    posY = scrollrange;
            } else {
                reset();
                speed = 0;
            }
            transfromTemplte[1] = posY;
            scrollContentStyle.webkitTransform = transfromTemplte.join("");
            
            console.log("Decelerate:", speed)
        }
        
        function reset(){
            if(globalID !== null) {
				window.cancelAnimationFrame(globalID);
            	globalID = null;
            }
        }
        
    }, false);
})(window);