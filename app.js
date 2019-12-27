// Registering service worker.
if ('serviceWorker' in navigator) {
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


function disable_resource_buttons(r) {
    var x;
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


function disable_all_resource_buttons() {
    var r;
    for (r of ['m', 's', 't', 'p', 'e', 'h']) {
	disable_resource_buttons(r);
    }
}


function enable_resource_buttons(r, minimum=0) {
    var x;
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


function enable_all_resource_buttons() {
    enable_resource_buttons('m', -5);
    var r;
    for (r of ['s', 't', 'p', 'e', 'h']) {
	enable_resource_buttons(r);
    }
}


function setup_resource_buttons(r, minimum=0) {
    let p = document.getElementById('app_r' + r + 'p');      // Production status element
    let pp = document.getElementById('app_r' + r + 'pp');    // Production '+' button
    let pm = document.getElementById('app_r' + r + 'pm');    // Production '-' button
    let s = document.getElementById('app_r' + r + 's');      // Supply status element
    let sp = document.getElementById('app_r' + r + 'sp');    // Supply '+' button
    let sp5 = document.getElementById('app_r' + r + 'sp5');  // Supply '+5' button
    let sm = document.getElementById('app_r' + r + 'sm');    // Supply '-' button
    let sm5 = document.getElementById('app_r' + r + 'sm5');  // Supply '-5' button

    let update_payment_buttons = function(v) {
	if (r == 'm' || r == 's' || r == 't') {
	    if (v>0) {
		document.getElementById('app_p' + r + 'p').classList.remove('disabled');
		if (r == 'm') {
		    if (v >= 5) {
			document.getElementById('app_pmp5').classList.remove('disabled');
		    } else {
			document.getElementById('app_pmp5').classList.add('disabled');
		    }
		}
	    } else {
		document.getElementById('app_p' + r + 'p').classList.add('disabled');
		if (r == 'm') {
		    document.getElementById('app_pmp5').classList.add('disabled');
		}
	    }
	}
    }
    
    pp.addEventListener('click', function(e) {
	if (! pp.classList.contains('disabled')) {
	    var v = parseInt(p.innerHTML);
	    v++;
	    pm.classList.remove('disabled');
	    p.innerHTML = v;
	}
    });
    pm.addEventListener('click', function(e) {
	if (! pm.classList.contains('disabled')) {
	    var v = parseInt(p.innerHTML);
	    v--;
	    if (v == minimum) {
		pm.classList.add('disabled');
	    }
	    p.innerHTML = v;
	}
    });
    sp.addEventListener('click', function(e) {
	if (! sp.classList.contains('disabled')) {
	    var v = parseInt(s.innerHTML);
	    v++;
	    sm.classList.remove('disabled');
	    if (v >= 5) {
		sm5.classList.remove('disabled');
	    }
	    s.innerHTML = v;
	    update_payment_buttons(v);
	}
    });
    sp5.addEventListener('click', function(e) {
	if (! sp5.classList.contains('disabled')) {
	    var v = parseInt(s.innerHTML);
	    v += 5;
	    sm.classList.remove('disabled');
	    sm5.classList.remove('disabled');
	    s.innerHTML = v;
	    update_payment_buttons(v);
	}
    });
    sm.addEventListener('click', function(e) {
	if (! sm.classList.contains('disabled')) {
	    var v = parseInt(s.innerHTML);
	    v--;
	    if (v < 5) {
		sm5.classList.add('disabled');
		if (v == 0) {
		    sm.classList.add('disabled');
		}
	    }
	    s.innerHTML = v;
	    update_payment_buttons(v);
	}
    });
    sm5.addEventListener('click', function(e) {
	if (! sm5.classList.contains('disabled')) {
	    var v = parseInt(s.innerHTML);
	    v -= 5;
	    if (v < 5) {
		sm5.classList.add('disabled');
		if (v == 0) {
		    sm.classList.add('disabled');
		}
	    }
	    s.innerHTML = v;
	    update_payment_buttons(v);
	}
    });
}


function setup_all_resource_buttons() {
    setup_resource_buttons('m', -5);
    var r;
    for (r of ['s', 't', 'p', 'e', 'h']) {
	setup_resource_buttons(r);
    }
}


function disable_paying_buttons() {
    var x;
    for (x of [ 'pmm5', 'pmm', 'pmp', 'pmp5', 'psm', 'psp', 'ptm', 'ptp', 'cncl', 'ok' ]) {
	document.getElementById('app_' + x).classList.add('disabled');
    }
}


function enable_paying_buttons() {
    var r;
    for (r of ['m', 's', 't']) {
	var s = parseInt(document.getElementById('app_r' + r + 's').innerHTML);
	var v = parseInt(document.getElementById('app_p' + r).innerHTML);
	if (r == 'm') {
	    if (s >= v+5) {
		document.getElementById('app_pmp5').classList.remove('disabled');
	    }
	    if (v >= 5) {
		document.getElementById('app_pmm5').classList.remove('disabled');
	    }
	}
	if (s > v) {
	    document.getElementById('app_p' + r + 'p').classList.remove('disabled');
	}
	if (v > 0) {
	    document.getElementById('app_p' + r + 'm').classList.remove('disabled');
	}
    }
}


function setup_paying_buttons() {
    let pmm5 = document.getElementById('app_pmm5');  // Paying, megacredits, '-5' button
    let pmm = document.getElementById('app_pmm');    // Paying, megacredits, '-' button
    let pm = document.getElementById('app_pm');      // Paying, megacredits
    let pmp = document.getElementById('app_pmp');    // Paying, megacredits, '+' button
    let pmp5 = document.getElementById('app_pmp5');  // Paying, megacredits, '+5' button
    let psm = document.getElementById('app_psm');    // Paying, steel, '-' button
    let ps = document.getElementById('app_ps');      // Paying, steel
    let psp = document.getElementById('app_psp');    // Paying, steel, '+' button
    let psv = document.getElementById('app_psv');    // Paying, steel, value
    let ptm = document.getElementById('app_ptm');    // Paying, titanium, '-' button
    let pt = document.getElementById('app_pt');      // Paying, titanium
    let ptp = document.getElementById('app_ptp');    // Paying, titanium, '+' button
    let ptv = document.getElementById('app_ptv');    // Paying, titanium, value
    let cncl = document.getElementById('app_cncl');  // Cancel button
    let pto = document.getElementById('app_pto');    // Paying, total
    let ok = document.getElementById('app_ok');      // Ok button
    let next = document.getElementById('app_next');  // Next (generation) button

    let update_total = function() {
	var total = parseInt(pm.innerHTML) + parseInt(psv.innerHTML) + parseInt(ptv.innerHTML);
	pto.innerHTML = total;
	if (total == 0) {
	    enable_all_resource_buttons();
	    enable_terraforming_rating_buttons();
	    cncl.classList.add('disabled');
	    ok.classList.add('disabled');
	    next.classList.remove('disabled');
	} else {
	    disable_all_resource_buttons();
	    disable_terraforming_rating_buttons();
	    cncl.classList.remove('disabled');
	    ok.classList.remove('disabled');
	    next.classList.add('disabled');
	}
    };
    
    pmm5.addEventListener('click', function(e) {
	if (! pmm5.classList.contains('disabled')) {
	    var m = parseInt(document.getElementById('app_rms').innerHTML);
	    var v = parseInt(pm.innerHTML);
	    v -= 5;
	    pmp.classList.remove('disabled');
	    if (v <= m-5) {
		pmp5.classList.remove('disabled');
	    }
	    if (v < 5) {
		pmm5.classList.add('disabled');
		if (v == 0) {
		    pmm.classList.add('disabled');
		}
	    }
	    pm.innerHTML = v;
	    update_total();
	}
    });
    pmm.addEventListener('click', function(e) {
	if (! pmm.classList.contains('disabled')) {
	    var m = parseInt(document.getElementById('app_rms').innerHTML);
	    var v = parseInt(pm.innerHTML);
	    v--;
	    pmp.classList.remove('disabled');
	    if (v <= m-5) {
		pmp5.classList.remove('disabled');
	    }
	    if (v < 5) {
		pmm5.classList.add('disabled');
		if (v == 0) {
		    pmm.classList.add('disabled');
		}
	    }
	    pm.innerHTML = v;
	    update_total();
	}
    });
    pmp.addEventListener('click', function(e) {
	if (! pmp.classList.contains('disabled')) {
	    var m = parseInt(document.getElementById('app_rms').innerHTML);
	    var v = parseInt(pm.innerHTML);
	    v++;
	    pmm.classList.remove('disabled');
	    if (v >= 5) {
		pmm5.classList.remove('disabled');
	    }
	    if (v > m-5) {
		pmp5.classList.add('disabled');
		if (v == m) {
		    pmp.classList.add('disabled');
		}
	    }
	    pm.innerHTML = v;
	    update_total();
	}
    });
    pmp5.addEventListener('click', function(e) {
	if (! pmp5.classList.contains('disabled')) {
	    var m = parseInt(document.getElementById('app_rms').innerHTML);
	    var v = parseInt(pm.innerHTML);
	    v += 5;
	    pmm.classList.remove('disabled');
	    pmm5.classList.remove('disabled');
	    if (v > m-5) {
		pmp5.classList.add('disabled');
		if (v == m) {
		    pmp.classList.add('disabled');
		}
	    }
	    pm.innerHTML = v;
	    update_total();
	}
    });
    psm.addEventListener('click', function(e) {
	if (! psm.classList.contains('disabled')) {
	    var s = parseInt(document.getElementById('app_rss').innerHTML);
	    var v = parseInt(ps.innerHTML);
	    v--;
	    psp.classList.remove('disabled');
	    if (v == 0) {
		psm.classList.add('disabled');
	    }
	    ps.innerHTML = v;
	    psv.innerHTML = 2*v;
	    update_total();
	}
    });
    psp.addEventListener('click', function(e) {
	if (! psp.classList.contains('disabled')) {
	    var s = parseInt(document.getElementById('app_rss').innerHTML);
	    var v = parseInt(ps.innerHTML);
	    v++;
	    psm.classList.remove('disabled');
	    if (v == s) {
		psp.classList.add('disabled');
	    }
	    ps.innerHTML = v;
	    psv.innerHTML = 2*v;
	    update_total();
	}
    });
    ptm.addEventListener('click', function(e) {
	if (! ptm.classList.contains('disabled')) {
	    var t = parseInt(document.getElementById('app_rts').innerHTML);
	    var v = parseInt(pt.innerHTML);
	    v--;
	    ptp.classList.remove('disabled');
	    if (v == 0) {
		ptm.classList.add('disabled');
	    }
	    pt.innerHTML = v;
	    ptv.innerHTML = 3*v;
	    update_total();
	}
    });
    ptp.addEventListener('click', function(e) {
	if (! ptp.classList.contains('disabled')) {
	    var t = parseInt(document.getElementById('app_rts').innerHTML);
	    var v = parseInt(pt.innerHTML);
	    v++;
	    ptm.classList.remove('disabled');
	    if (v == t) {
		ptp.classList.add('disabled');
	    }
	    pt.innerHTML = v;
	    ptv.innerHTML = 3*v;
	    update_total();
	}
    });
    cncl.addEventListener('click', function(e) {
	if (! cncl.classList.contains('disabled')) {
	    pm.innerHTML = 0;
	    ps.innerHTML = 0;
	    psv.innerHTML = 0;
	    pt.innerHTML = 0;
	    ptv.innerHTML = 0;
	    update_total();
	    disable_paying_buttons();
	    enable_paying_buttons();
	    next.classList.remove('disabled');
	}
    });
    ok.addEventListener('click', function(e) {
	if (! ok.classList.contains('disabled')) {
	    var r;
	    for (r of [ 'm', 's', 't' ]) {
		s = document.getElementById('app_r' + r + 's');
		p = document.getElementById('app_p' + r);
		s.innerHTML = parseInt(s.innerHTML) - parseInt(p.innerHTML);
		p.innerHTML = 0;
		if (r != 'm') {
		    document.getElementById('app_p' + r + 'v').innerHTML = 0;
		}
	    }
	    pto.innerHTML = 0;
	    disable_all_resource_buttons();
	    enable_all_resource_buttons();
	    disable_paying_buttons();
	    enable_paying_buttons();
	    cncl.classList.add('disabled');
	    ok.classList.add('disabled');
	    next.classList.remove('disabled');
	}
    });
}


function disable_terraforming_rating_buttons() {
    document.getElementById('app_trm').classList.add('disabled');
    document.getElementById('app_trp').classList.add('disabled');
    document.getElementById('app_trp5').classList.add('disabled');
}


function enable_terraforming_rating_buttons() {
    document.getElementById('app_trm').classList.remove('disabled');
    document.getElementById('app_trp').classList.remove('disabled');
    document.getElementById('app_trp5').classList.remove('disabled');
}


function setup_terraforming_rating_buttons() {
    let trm = document.getElementById('app_trm');
    let trp = document.getElementById('app_trp');
    let trp5 = document.getElementById('app_trp5');
    let tr = document.getElementById('app_tr');

    trm.addEventListener('click', function(e) {
	if (! trm.classList.contains('disabled')) {
	    var v = parseInt(tr.innerHTML);
	    v--;
	    if (v == 0) {
		trm.classList.add('disabled');
	    }
	    tr.innerHTML = v;
	}
    });
    trp.addEventListener('click', function(e) {
	if (! trp.classList.contains('disabled')) {
	    var v = parseInt(tr.innerHTML);
	    v++;
	    trm.classList.remove('disabled');
	    tr.innerHTML = v;
	}
    });
    trp5.addEventListener('click', function(e) {
	if (! trp5.classList.contains('disabled')) {
	    var v = parseInt(tr.innerHTML);
	    v += 5;
	    trm.classList.remove('disabled');
	    tr.innerHTML = v;
	}
    });
}


function setup_generation_button() {
    let g = document.getElementById('app_g');  // Generation
    let next = document.getElementById('app_next');  // Next (generation) button

    next.addEventListener('click', function(e) {
	if (! next.classList.contains('disabled')) {
	    g.innerHTML = parseInt(g.innerHTML)+1;
	}
	var h = document.getElementById('app_rhs');
	var e = document.getElementById('app_res');
	h.innerHTML = parseInt(h.innerHTML) + parseInt(e.innerHTML);
	e.innerHTML = 0;
	var tr = parseInt(document.getElementById('app_tr').innerHTML);
	var m = document.getElementById('app_rms');
	m.innerHTML = parseInt(m.innerHTML) + tr;
	var r;
	for (r of [ 'm', 's', 't', 'p', 'e', 'h']) {
	    var s = document.getElementById('app_r' + r + 's');
	    var p = parseInt(document.getElementById('app_r' + r + 'p').innerHTML);
	    s.innerHTML = parseInt(s.innerHTML) + p;
	}
	disable_all_resource_buttons();
	enable_all_resource_buttons();
	disable_paying_buttons();
	enable_paying_buttons();
    });
}


disable_all_resource_buttons();
enable_all_resource_buttons();
setup_all_resource_buttons();

disable_paying_buttons();
enable_paying_buttons();
setup_paying_buttons();

disable_terraforming_rating_buttons();
enable_terraforming_rating_buttons();
setup_terraforming_rating_buttons();

setup_generation_button();

