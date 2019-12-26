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
	document.getElementById('app_pmh').style.display = 'flex';
	document.getElementById('app_psh').style.display = 'flex';
	document.getElementById('app_pth').style.display = 'flex';
	document.body.classList.remove('landscape');
	document.body.classList.add('portrait');
	if ( W/9 < H/15 ) {
	    M = W/9;
	} else {
	    M = H/15;
	}
    } else {
	document.getElementById('app_pmh').style.display = 'none';
	document.getElementById('app_psh').style.display = 'none';
	document.getElementById('app_pth').style.display = 'none';
	document.body.classList.remove('portrait');
	document.body.classList.add('landscape');
	if ( W/17 < H/8 ) {
	    M = W/17;
	} else {
	    M = H/8;
	}
    }
    document.body.style.fontSize = Math.round(0.28*M) + "pt";
}
window.addEventListener('resize', resize_handler);
resize_handler();

function disable_resource_handlers(r) {
    for (x of [
	'pp',   // Production '+' button
	'pm',   // Production '-' button
	'sp',   // Supply '+' button
	'sp5',  // Supply '+5' button
	'sm',   // Supply '-' button 
	'sm5'   // Supply '-5' button
    ]) {
	document.getElementById('app_r' + r + x).classList.add('disabled');    
    }
}

function enable_resource_handlers(r, minimum=0) {
    for (x of [ 
	'pp',  // Production '+' button
	'sp',  // Supply '+' button
	'sp5'  // Supply '+5' button
    ]) {
	document.getElementById('app_r' + r + x).classList.remove('disabled');
    }

    var v = parseInt(document.getElementById('app_r' + r + 'p').innerHTML);
    if (v > minimum) {  // Production '-' button
	document.getElementById('app_r' + r + 'pm').classList.remove('disabled');
    }    

    v = parseInt(document.getElementById('app_r' + r + 's').innerHTML);
    if (v > 0) {  // Supply '-' button
	document.getElementById('app_r' + r + 'sm').classList.remove('disabled');
	if (v >= 5) {  // Supply '-5' button
	    document.getElementById('app_r' + r + 'sm5').classList.remove('disabled');
	}
    }
}

function setup_resource_handlers(r, minimum=0) {
    let p = document.getElementById('app_r' + r + 'p');      // Production status element
    let pp = document.getElementById('app_r' + r + 'pp');    // Production '+' button
    let pm = document.getElementById('app_r' + r + 'pm');    // Production '-' button
    let s = document.getElementById('app_r' + r + 's');      // Supply status element
    let sp = document.getElementById('app_r' + r + 'sp');    // Supply '+' button
    let sp5 = document.getElementById('app_r' + r + 'sp5');  // Supply '+5' button
    let sm = document.getElementById('app_r' + r + 'sm');    // Supply '-' button
    let sm5 = document.getElementById('app_r' + r + 'sm5');  // Supply '-5' button

    var v = parseInt(p.innerHTML);
    if (v > minimum) {
	pm.classList.remove('disabled');
    } else {
	pm.classList.add('disabled');
    }
    pp.addEventListener('click', function(e) {
	v = parseInt(p.innerHTML);
	v++;
	pm.classList.remove('disabled');
	p.innerHTML = v;
    });
    pm.addEventListener('click', function(e) {
	v = parseInt(p.innerHTML);
	if (v > minimum) {
	    v--;
	    if (v == minimum) {
		pm.classList.add('disabled');
	    }
	    p.innerHTML = v;
	}
    });
    v = parseInt(s.innerHTML);
    if (v > 0) {
	sm.classList.remove('disabled');
	if (v >= 5) {
	    sm5.classList.remove('disabled');
	}
    } else {
	sm.classList.add('disabled');
	sm5.classList.add('disabled');
    }
    sp.addEventListener('click', function(e) {
	v = parseInt(s.innerHTML);
	v++;
	sm.classList.remove('disabled');
	if (v >= 5) {
	    sm5.classList.remove('disabled');
	}
	s.innerHTML = v;
    });
    sp5.addEventListener('click', function(e) {
	v = parseInt(s.innerHTML);
	v += 5;
	sm.classList.remove('disabled');
	sm5.classList.remove('disabled');
	s.innerHTML = v;
    });
    sm.addEventListener('click', function(e) {
	v = parseInt(s.innerHTML);
	if (v > 0) {
	    v--;
	}
	if (v < 5) {
	    sm5.classList.add('disabled');
	    if (v == 0) {
		sm.classList.add('disabled');
	    }
	}
	s.innerHTML = v;
    });
    sm5.addEventListener('click', function(e) {
	v = parseInt(s.innerHTML);
	if (v >= 5) {
	    v -= 5;
	}
	if (v < 5) {
	    sm5.classList.add('disabled');
	    if (v == 0) {
		sm.classList.add('disabled');
	    }
	}
	s.innerHTML = v;
    });
}

function setup_all_resource_handlers() {
    setup_resource_handlers('m', -5);
    for (r of ['s', 't', 'p', 'e', 'h']) {
	setup_resource_handlers(r);
    }
}

function disable_all_resource_handlers() {
    for (r of ['m', 's', 't', 'p', 'e', 'h']) {
	disable_resource_handlers(r);
    }
}

function enable_all_resource_handlers() {
    enable_resource_handlers('m', -5);
    for (r of ['s', 't', 'p', 'e', 'h']) {
	enable_resource_handlers(r);
    }
}


setup_all_resource_handlers();
