"use strict";

function onload() {
    createTabs();
}

function createTabs() {
    var tabs = document.querySelectorAll('.tab-box li a');
    var tab;
    for (i = 0; i < tabs.length; i++) {
        setTabHandler(tabs[i], i);
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
    };
}