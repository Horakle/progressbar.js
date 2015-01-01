// Global state
var state = {
    exampleCodes: {},
    bars: []
};


function onLoad() {
    initExternalLibs();
    initLanding();
    initExamples();
    initStar();
}

function initExternalLibs() {
    smoothScroll.init({
        easing: 'easeOutCubic'
    });

    // jQuery is not needed anywhere else but here
    $('.fixed').midnight();
}

function initLanding() {
    var circle = new ProgressBar.Circle('#landing-progress', {
        color: "#FCB03C",
        strokeWidth: 1.5,
        trailColor: null,
        fill: "#FFF9F0"
    });

    circle.animate(1, {
        duration: 1200,
        easing: 'easeInOut'
    });
}

function initExamples() {
    var elements = document.querySelectorAll('.example');
    var elementsArray = Array.prototype.slice.call(elements, 0);

    // Ugly way to check if all scripts are loaded, promises would be easier
    var loaded = 0;
    elementsArray.forEach(function(element) {
        var codeContainer = element.querySelector('.code');

        var url = 'scripts/' + element.id + '.js';
        get(url, function(req) {
            var code = req.responseText;

            runExample(code, element.id);
            state.exampleCodes[element.id] = code;

            codeContainer.innerHTML = '<pre><code data-language="javascript"></code></pre>';
            element.querySelector('code').innerHTML = escapeEntities(code);
            loaded++;

            var allLoaded = loaded === elementsArray.length - 1;
            if (allLoaded) {
                // Rainbow can be called only once or it breaks.
                setTimeout(Rainbow.color(), 100);
            }
        });

        var runButton = element.querySelector('.run');
        runButton.onclick = function() {
            console.log('destroy')
            state.bars[element.id].destroy();
            element.querySelector('.example-container').innerHTML = '';
            runExample(state.exampleCodes[element.id], element.id);
        };
    });
}

function runExample(code, name) {
    // Run code in anonymous function scope
    var scopedCode =  code ;

    try {
        eval(scopedCode);
        state.bars[name] = bar;
    } catch(err) {
        var error = err.name + ': ' + err.message;
        window.alert(error);
    }
}

function initStar() {
    var star = document.getElementById('star');
    var path = new ProgressBar.Path(star.contentDocument.querySelector('#star-path'), {
        easing: "easeInOut"
    });
    path.set(1);

    var element = document.querySelector('.social-links > .github');
    element.onmouseover = function() {
        path.animate(0, {duration: 800});
    }

    element.onmouseout = function() {
        path.animate(1, {duration: 600});
    }
}

function get(url, cb) {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (req.readyState !== XMLHttpRequest.DONE) {
            return;
        }

        cb(req);
    }

    req.open("GET", url, true);
    req.send();
}

function escapeEntities(code) {
    return code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

$(window).load(onLoad);
