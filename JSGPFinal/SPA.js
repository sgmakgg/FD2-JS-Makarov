import {increaseScore, decreaseScore, updateStats} from './statistic.js';
export function switchToState(newState) {
    location.hash = newState;
}

export function switchToStateFromURLHash(){
    let URLHash=window.location.hash;
    let stateStr = URLHash.substr(1);

    if ( stateStr === "" )
        stateStr ='Main';

    switch (stateStr) {
        case 'Main':
            startScreen('memo');
            break;
        case 'Game':
            break;
    }
}

export function startScreen(text) {
    let elem = document.getElementById('g');
    elem.removeAttribute('class');
    elem.innerHTML = '';
    elem = document.getElementById('logoId');
    elem.removeAttribute('style');

    document.querySelector('.c1').innerHTML = text.substring(0, 1);
    document.querySelector('.c2').innerHTML = text.substring(1, 2);
    document.querySelector('.c3').innerHTML = text.substring(2, 3);
    document.querySelector('.c4').innerHTML = text.substring(3, 4);

    // If won game
    if (text === 'cool') {
        increaseScore('flip_won');
        decreaseScore('flip_abandoned');
    }

    // If lost game
    else if (text === 'oops') {
        increaseScore('flip_lost');
        decreaseScore('flip_abandoned');
    }

    updateStats();
}