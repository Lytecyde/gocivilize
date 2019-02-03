//create hex for a canvas
function drawCanvas(){
    var canvasMap =  document.getElementById('map');
    getHexGridWH(canvasMap);
}

//create tabs    
function tabs(){
    var tabs = document.querySelectorAll('.tab-box li a');
    var panels = document.querySelectorAll('article');

    for(i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        setTabHandler(tab, i);
    }
    
}

function setTabHandler(tab, tabPos) {
    tab.onclick = function() {
        for(i = 0; i < tabs.length; i++) {
        tabs[i].className = '';
        }

        tab.className = 'active';

        for(i = 0; i < panels.length; i++) {
        panels[i].className = '';
        }

        panels[tabPos].className = 'active-panel';
    }
}
    
