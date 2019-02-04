//create hex for a canvas
function drawCanvas() {
    getHexGridWH();
}

//create tabs    
function tabs() {
    var tabs = document.querySelectorAll('.tab-box li a');

    for (i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        setTabHandler(tab, i);
    }
}

function setTabHandler(tab, tabPos) {
    var panels = document.querySelectorAll('article');

    tab.onclick = function() {
        for (i = 0; i < tabs.length; i++) {
            tabs[i].className = '';
        }

        tab.className = 'active';

        for (i = 0; i < panels.length; i++) {
            panels[i].className = '';
        }

        panels[tabPos].className = 'active-panel';
    }
}