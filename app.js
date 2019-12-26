// Registering service worker.
if ('serviceWorker DISABLED' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
        //console.log('Service worker successfully registered on scope', registration.scope);
    }).catch(function(error) {
        console.log('Service worker failed to register');
    });
};

// Make the app responsive.
function resize_handler() {
    var W = document.documentElement.clientWidth;
    var H = document.documentElement.clientHeight;
    var M;
    if (W < H) {
	console.log('portrait');
	document.body.classList.remove('landscape');
	document.body.classList.add('portrait');
	if ( W/9 < H/15 ) {
	    M = W/9;
	} else {
	    M = H/15;
	}
    } else {
	console.log('landscape');
	document.body.classList.remove('portrait');
	document.body.classList.add('landscape');
	if ( W/17 < H/8 ) {
	    M = W/17;
	} else {
	    M = H/8;
	}
    }
    document.body.style.fontSize = Math.round(0.3*M) + "pt";
}
window.addEventListener('resize', resize_handler);
resize_handler();

