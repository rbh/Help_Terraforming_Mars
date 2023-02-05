// Registering service worker.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
        //console.log('Service worker successfully registered on scope', registration.scope);
    }).catch(function(error) {
        console.log('Service worker failed to register');
    });
};


var states = [];
var last_ids = [];

function save_state(id) {
    if (id === null || last_ids.length == 0 || id != last_ids[last_ids.length-1]) {
	last_ids.push(id);
	let state = {};
	for (x of document.getElementsByClassName('app_item')) {
	    state[x.id] = x.innerHTML;
	}
	for (x of document.getElementsByClassName('app_itembutton')) {
	    state[x.id] = x.innerHTML;
	}
	for (x of document.getElementsByClassName('app_button')) {
	    state[x.id] = x.classList.contains('disabled');
	}
	states.push(state);
	document.getElementById('app_undo').classList.remove('disabled');
    }
}


// Make the app responsive.
function resize_handler() {
    let W = document.documentElement.clientWidth;
    let H = document.documentElement.clientHeight;
    let M;
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
    for (let x of [
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
    for (let r of ['m', 's', 't', 'p', 'e', 'h']) {
	disable_resource_buttons(r);
    }
}


function enable_resource_buttons(r, minimum=0) {
    for (let x of [ 
	'pp',  // Production '+' button
	'sp',  // Supply '+' button
	'sp5'  // Supply '+5' button
    ]) {
	document.getElementById('app_r' + r + x).classList.remove('disabled');
    }
    let v = parseInt(document.getElementById('app_r' + r + 'p').innerHTML);
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
    for (let r of ['s', 't', 'p', 'e', 'h']) {
	enable_resource_buttons(r);
    }
}


function disable_value_buttons() {
    document.getElementById('app_psx').classList.add('disabled')
    document.getElementById('app_ptx').classList.add('disabled')
}


function enable_value_buttons() {
    document.getElementById('app_psx').classList.remove('disabled')
    document.getElementById('app_ptx').classList.remove('disabled')
}


function log_change(what, from, to) {
    let log = document.getElementById('big_popup_text_log');
    let l = log.children.length;
    let d = new Date();
    let now = d.valueOf();
    if (log.children.length > 0) {
	let last_log_entry = log.children[l-1];
	if (parseInt(last_log_entry.getAttribute('when')) >= now-5000) {
	    let r = new RegExp(what.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+from\\s+(\\d+)\\s+to\\s+(\\d+)');
	    let m = last_log_entry.innerHTML.match(r);
	    if (m) {
		if (parseInt(m[2])==from) {
		    from = parseInt(m[1]);
		    log.removeChild(last_log_entry);
		}
	    }
	}
    }
    if (from != to) {
	let direction = from < to ? "Increase" : "Decrease";
	let s = document.createElement("span");
	s.setAttribute('when', now);
	s.innerHTML = d.toLocaleTimeString() + ': ' + direction + " " + what + " from " + from + " to " + to + "<br/>";
	log.appendChild(s);
    }
}


function log_event(what) {
    let log = document.getElementById('big_popup_text_log');
    let d = new Date();
    let now = d.valueOf();
    let s = document.createElement("span");
    s.setAttribute('when', now);
    s.innerHTML = d.toLocaleTimeString() + ': ' + what + "<br/>";
    log.appendChild(s);
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

    let n = '';
    if (r == 'm') {
	n = 'megacredits';
    } else if (r == 's') {
	n = 'steel';
    } else if (r == 't') {
	n = 'titanium';
    } else if (r == 'p') {
	n = 'plants';
    } else if (r == 'e') {
	n = 'energy';
    } else if (r == 'h') {
	n = 'heat';
    }
    
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
	    save_state(e.currentTarget.id);
	    let v = parseInt(p.innerHTML);
	    log_change(n + ' production', v, v+1);
	    v++;
	    pm.classList.remove('disabled');
	    p.innerHTML = v;
	}
    });
    pm.addEventListener('click', function(e) {
	if (! pm.classList.contains('disabled')) {
	    save_state(e.currentTarget.id);
	    let v = parseInt(p.innerHTML);
	    log_change(n + ' production', v, v-1);
	    v--;
	    if (v == minimum) {
		pm.classList.add('disabled');
	    }
	    p.innerHTML = v;
	}
    });
    sp.addEventListener('click', function(e) {
	if (! sp.classList.contains('disabled')) {
	    save_state(e.currentTarget.id);
	    let v = parseInt(s.innerHTML);
	    log_change(n + ' supply', v, v+1);
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
	    save_state(e.currentTarget.id);
	    let v = parseInt(s.innerHTML);
	    log_change(n + ' supply', v, v+5);
	    v += 5;
	    sm.classList.remove('disabled');
	    sm5.classList.remove('disabled');
	    s.innerHTML = v;
	    update_payment_buttons(v);
	}
    });
    sm.addEventListener('click', function(e) {
	if (! sm.classList.contains('disabled')) {
	    save_state(e.currentTarget.id);
	    let v = parseInt(s.innerHTML);
	    log_change(n + ' supply', v, v-1);
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
	    save_state(e.currentTarget.id);
	    let v = parseInt(s.innerHTML);
	    log_change(n + ' supply', v, v-5);
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
    for (let r of ['s', 't', 'p', 'e', 'h']) {
	setup_resource_buttons(r);
    }
}


function disable_terraforming_rating_buttons() {
    document.getElementById('app_trm').classList.add('disabled');
    document.getElementById('app_trp').classList.add('disabled');
}


function enable_terraforming_rating_buttons() {
    document.getElementById('app_trm').classList.remove('disabled');
    document.getElementById('app_trp').classList.remove('disabled');
}


function setup_terraforming_rating_buttons() {
    let trm = document.getElementById('app_trm');
    let trp = document.getElementById('app_trp');
    let tr = document.getElementById('app_tr');

    trm.addEventListener('click', function(e) {
	if (! trm.classList.contains('disabled')) {
	    save_state(e.currentTarget.id);
	    let v = parseInt(tr.innerHTML);
	    log_change('terraforming rating', v, v-1);
	    v--;
	    if (v == 0) {
		trm.classList.add('disabled');
	    }
	    tr.innerHTML = v;
	}
    });
    trp.addEventListener('click', function(e) {
	if (! trp.classList.contains('disabled')) {
	    save_state(e.currentTarget.id);
	    let v = parseInt(tr.innerHTML);
	    log_change('terraforming rating', v, v+1);
	    v++;
	    trm.classList.remove('disabled');
	    tr.innerHTML = v;
	}
    });
}


function disable_paying_buttons() {
    for (let x of [ 'pmm5', 'pmm', 'pmp', 'pmp5', 'psm', 'psp', 'ptm', 'ptp', 'cncl', 'ok' ]) {
	document.getElementById('app_' + x).classList.add('disabled');
    }
}


function enable_paying_buttons() {
    for (let r of ['m', 's', 't']) {
	let s = parseInt(document.getElementById('app_r' + r + 's').innerHTML);
	let v = parseInt(document.getElementById('app_p' + r).innerHTML);
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
    let u = document.getElementById('app_undo');  // Undo button

    let update_total = function() {
	let total = parseInt(pm.innerHTML) + parseInt(psv.innerHTML) + parseInt(ptv.innerHTML);
	pto.innerHTML = total;
	if (total == 0) {
	    enable_all_resource_buttons();
	    enable_value_buttons();
	    enable_terraforming_rating_buttons();
	    cncl.classList.add('disabled');
	    ok.classList.add('disabled');
	    next.classList.remove('disabled');
	    states.pop();
	    if (states.length > 0) {
		u.classList.remove('disabled');
	    }
	} else {
	    disable_all_resource_buttons();
	    disable_value_buttons();
	    disable_terraforming_rating_buttons();
	    cncl.classList.remove('disabled');
	    ok.classList.remove('disabled');
	    next.classList.add('disabled');
	    u.classList.add('disabled');
	}
	return total;
    };
    
    pmm5.addEventListener('click', function(e) {
	if (! pmm5.classList.contains('disabled')) {
	    let m = parseInt(document.getElementById('app_rms').innerHTML);
	    let v = parseInt(pm.innerHTML);
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
	    let m = parseInt(document.getElementById('app_rms').innerHTML);
	    let v = parseInt(pm.innerHTML);
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
	    if (cncl.classList.contains('disabled')) {
		save_state('pay');
	    }
	    let m = parseInt(document.getElementById('app_rms').innerHTML);
	    let v = parseInt(pm.innerHTML);
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
	    if (cncl.classList.contains('disabled')) {
		save_state('pay');
	    }
	    let m = parseInt(document.getElementById('app_rms').innerHTML);
	    let v = parseInt(pm.innerHTML);
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
	    let s = parseInt(document.getElementById('app_rss').innerHTML);
	    let v = parseInt(ps.innerHTML);
	    v--;
	    psp.classList.remove('disabled');
	    if (v == 0) {
		psm.classList.add('disabled');
	    }
	    ps.innerHTML = v;
	    psv.innerHTML = parseInt(document.getElementById('app_psx').innerHTML.substr(1))*v;
	    update_total();
	}
    });
    psp.addEventListener('click', function(e) {
	if (! psp.classList.contains('disabled')) {
	    if (cncl.classList.contains('disabled')) {
		save_state('pay');
	    }
	    let s = parseInt(document.getElementById('app_rss').innerHTML);
	    let v = parseInt(ps.innerHTML);
	    v++;
	    psm.classList.remove('disabled');
	    if (v == s) {
		psp.classList.add('disabled');
	    }
	    ps.innerHTML = v;
	    psv.innerHTML = parseInt(document.getElementById('app_psx').innerHTML.substr(1))*v;
	    update_total();
	}
    });
    ptm.addEventListener('click', function(e) {
	if (! ptm.classList.contains('disabled')) {
	    let t = parseInt(document.getElementById('app_rts').innerHTML);
	    let v = parseInt(pt.innerHTML);
	    v--;
	    ptp.classList.remove('disabled');
	    if (v == 0) {
		ptm.classList.add('disabled');
	    }
	    pt.innerHTML = v;
	    ptv.innerHTML = parseInt(document.getElementById('app_ptx').innerHTML.substr(1))*v;
	    update_total();
	}
    });
    ptp.addEventListener('click', function(e) {
	if (! ptp.classList.contains('disabled')) {
	    if (cncl.classList.contains('disabled')) {
		save_state('pay');
	    }
	    let t = parseInt(document.getElementById('app_rts').innerHTML);
	    let v = parseInt(pt.innerHTML);
	    v++;
	    ptm.classList.remove('disabled');
	    if (v == t) {
		ptp.classList.add('disabled');
	    }
	    pt.innerHTML = v;
	    ptv.innerHTML = parseInt(document.getElementById('app_ptx').innerHTML.substr(1))*v;
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
	    let l = [];
	    let has_steel_or_titanium = false;
	    let total = parseInt(document.getElementById('app_pto').innerHTML);
	    let total_str;
	    if (total != 1) {
		total_str = total + ' megacredits';
	    } else {
		total_str = '1 megacredit';
	    }
	    for (let r of [ 'm', 's', 't' ]) {
		let s = document.getElementById('app_r' + r + 's');
		let p = document.getElementById('app_p' + r);
		let v = parseInt(p.innerHTML);
		s.innerHTML = parseInt(s.innerHTML) - v;
		p.innerHTML = 0;
		if (r != 'm') {
		    document.getElementById('app_p' + r + 'v').innerHTML = 0;
		}
		if (v != 0) {
		    if (r == 'm') {
			if (v != 1) {
			    l.push(v + ' megacredits');
			} else {
			    l.push('1 megacredit');
			}
		    } else if (r == 's') {
			l.push(v + ' steel');
			has_steel_or_titanium = true;
		    } else if (r == 't') {
			l.push(v + ' titanium')
			has_steel_or_titanium = true;
		    }
		}
	    }
	    save_state(e.currentTarget.id);  // update_total pops a state, so we save one it can pop.
	    update_total();
	    if (l.length == 1) {
		if (has_steel_or_titanium) {
		    log_event('Purchase for ' + l[0] + ' with a total value of ' + total_str);
		} else {
		    log_event('Purchase for ' + l[0]);
		}
	    } else if (l.length == 2) {
		log_event('Purchase for ' + l[0] + ' and ' + l[1] + ' with a total value of ' + total_str);
	    } else {
		log_event('Purchase for ' + l[0] + ', ' + l[1] + ', and ' + l[2] + ' with a total value of ' + total_str);
	    }
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


function setup_generation_button() {
    let g = document.getElementById('app_g');  // Generation
    let next = document.getElementById('app_next');  // Next (generation) button

    next.addEventListener('click', function(ev) {
	if (! next.classList.contains('disabled')) {
	    save_state(ev.currentTarget.id);
	    let gen = parseInt(g.innerHTML)+1
	    g.innerHTML = gen;
	    log_event('Advance to generation ' + gen);
	    let h = document.getElementById('app_rhs');
	    let e = document.getElementById('app_res');
	    h.innerHTML = parseInt(h.innerHTML) + parseInt(e.innerHTML);
	    e.innerHTML = 0;
	    let tr = parseInt(document.getElementById('app_tr').innerHTML);
	    let m = document.getElementById('app_rms');
	    m.innerHTML = parseInt(m.innerHTML) + tr;
	    for (let r of [ 'm', 's', 't', 'p', 'e', 'h']) {
		let s = document.getElementById('app_r' + r + 's');
		let p = parseInt(document.getElementById('app_r' + r + 'p').innerHTML);
		s.innerHTML = parseInt(s.innerHTML) + p;
	    }
	    disable_all_resource_buttons();
	    enable_all_resource_buttons();
	    disable_paying_buttons();
	    enable_paying_buttons();
	}
    });
}


function popup_box_right_undo(e) {
    let u = document.getElementById('app_undo');  // Undo button
    if (! u.classList.contains('disabled')) {
	if (states.length > 0) {
	    let state = states.pop();
	    last_ids.pop();
	    for (id in state) {
		x = document.getElementById(id);
		if (x.classList.contains('app_item') || x.classList.contains('app_itembutton')) {
		    x.innerHTML = state[id];
		} else if (x.classList.contains('app_button')) {
		    if (state[id]) {
			x.classList.add('disabled');
		    } else {
			x.classList.remove('disabled');
		    }
		}
	    }
	    if (states.length == 0) {
		u.classList.add('disabled');
	    }
	}
    }
}


function popup_box_right_reset(e) {
    if (states.length > 0) {
	save_state('reset');
    }
    log_event('Reset');
    document.getElementById('app_rmp').innerHTML = 0;
    document.getElementById('app_rms').innerHTML = 30;
    document.getElementById('app_rsp').innerHTML = 0;
    document.getElementById('app_rss').innerHTML = 0;
    document.getElementById('app_rtp').innerHTML = 0;
    document.getElementById('app_rts').innerHTML = 0;
    document.getElementById('app_rpp').innerHTML = 0;
    document.getElementById('app_rps').innerHTML = 0;
    document.getElementById('app_rep').innerHTML = 0;
    document.getElementById('app_res').innerHTML = 0;
    document.getElementById('app_rhp').innerHTML = 0;
    document.getElementById('app_rhs').innerHTML = 0;
    document.getElementById('app_tr').innerHTML = 20;
    document.getElementById('app_g').innerHTML = 1;
    document.getElementById('app_pm').innerHTML = 0;
    document.getElementById('app_ps').innerHTML = 0;
    document.getElementById('app_psv').innerHTML = 0;
    document.getElementById('app_psx').innerHTML = '×2';
    document.getElementById('app_pt').innerHTML = 0;
    document.getElementById('app_ptv').innerHTML = 0;
    document.getElementById('app_ptx').innerHTML = '×3';
    document.getElementById('app_pto').innerHTML = 0;
    document.getElementById('app_next').classList.remove('disabled');
    disable_all_resource_buttons();
    enable_all_resource_buttons();
    disable_paying_buttons();
    enable_paying_buttons();
    disable_terraforming_rating_buttons();
    enable_terraforming_rating_buttons();
}

function change_value(id, name, value) {
    let elem = document.getElementById(id);
    old = parseInt(elem.innerHTML.substr(1))
    if (old != value) {
	save_state(null);
	log_change(name + ' value', old, value);
	elem.innerHTML = '×' + value;
    }
}


function popup_box_left_steel_value(e) {
    change_value('app_psx', 'steel', 2);
}


function popup_box_right_steel_value(e) {
    change_value('app_psx', 'steel', 3);
}


function popup_box_left_titanium_value(e) {
    change_value('app_ptx', 'titanium', 3);
}


function popup_box_middle_titanium_value(e) {
    change_value('app_ptx', 'titanium', 4);
}


function popup_box_right_titanium_value(e) {
    change_value('app_ptx', 'titanium', 5);
}


function popup_click(e) {
    deactivate_popup();
    let elem = e.currentTarget
    if (! elem.classList.contains('disabled')) {
	for (let child of elem.children) {
	    if (child.style.display == 'inline') {
		if (window.hasOwnProperty(child.id)) {
		    console.log(child.id);
		    window[child.id](e);
		    break
		}
	    }
	}
    }
}


function setup_popup() {
    // Reset
    document.getElementById('app_reset').addEventListener('click', function(e) {
	if (! e.currentTarget.classList.contains('disabled')) {
	    activate_popup('reset');
	}
    });
    // Undo
    document.getElementById('app_undo').addEventListener('click', function(e) {
	if (! e.currentTarget.classList.contains('disabled')) {
	    activate_popup('undo');
	}
    });
    // Steel value
    document.getElementById('app_psx').addEventListener('click', function(e) {
	if (! e.currentTarget.classList.contains('disabled')) {
	    activate_popup('steel_value');
	}
    });
    // Titanium value
    document.getElementById('app_ptx').addEventListener('click', function(e) {
	if (! e.currentTarget.classList.contains('disabled')) {
	    activate_popup('titanium_value');
	}
    });
    // Generic buttons
    document.getElementById('popup_box_left').addEventListener('click', popup_click);
    document.getElementById('popup_box_middle').addEventListener('click', popup_click);
    document.getElementById('popup_box_right').addEventListener('click', popup_click);
}


function activate_popup(what) {
    let popup_box = document.getElementById('popup_box');
    for (elem of popup_box.children) {
	if (elem.id.startsWith('popup_box_')) {
	    let child_id_prefix = elem.id + '_';
	    let elem_display = 'none';
	    for (child of elem.children) {
		if (child.id.startsWith(child_id_prefix)) {
		    if (child.id.substr(child_id_prefix.length) == what) {
			child.style.display = 'inline';
			elem_display = 'inline';
		    } else {
			child.style.display = 'none';
		    }
		}
	    }
	    elem.style.display = elem_display;
	}
    }
    document.getElementById('popup').style.display='block';
}


function deactivate_popup() {
    document.getElementById('popup').style.display = 'none';
}


function activate_big_popup(x) {
    big_popup_text = document.getElementById('big_popup_text');
    for (child of big_popup_text.children) {
	if (child.id.startsWith('big_popup_text_')) {
	    if (child.id.substr(15) == x) {
		child.style.display = 'inline';
	    } else {
		child.style.display = 'none';
	    }
	}
    }
    document.getElementById('big_popup').style.display = 'block';
    b = document.getElementById('big_popup_box');
    b.scroll(0, b.scrollHeight);
}


function deactivate_big_popup() {
    document.getElementById('big_popup').style.display = 'none';
}


function setup_big_popup() {
    document.getElementById('app_log').addEventListener('click', function(e) {
	if (! e.currentTarget.classList.contains('disabled')) {
	    activate_big_popup('log');
	}
    });
    document.getElementById('big_popup').addEventListener('click', function(e) {
	deactivate_big_popup();
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

setup_popup();

setup_big_popup();
