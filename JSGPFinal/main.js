import {soundInit, playSound} from './sounds.js';
import {setLocalStorage, getValue, increaseScore, updateStats, decreaseScore} from './statistic.js';

document.addEventListener('DOMContentLoaded', memoGame);
function memoGame() {
        if ("ontouchstart" in window)
            document.querySelector('#touches').innerHTML = 'Touches are supporting';

        switchToState('Main');
        window.onhashchange = switchToStateFromURLHash;

        let currentGameState = {
            startScreenText: 'memo'
        };

        // Game load
        // Init localStorage
        if (!getValue('flip_won') && !getValue('flip_lost') && !getValue('flip_abandoned')) {
            //Overall Game stats
            setLocalStorage('flip_won', 0);
            setLocalStorage('flip_lost', 0);
            setLocalStorage('flip_abandoned', 0);

            //Best times
            setLocalStorage('flip_casual', '-:-');
            setLocalStorage('flip_medium', '-:-');
            setLocalStorage('flip_hard', '-:-');

            //Cards stats
            setLocalStorage('flip_matched', 0);
            setLocalStorage('flip_wrong', 0);
        }

        // Fill stats
        if (getValue('flip_won') > 0 || getValue('flip_lost') > 0 || getValue('flip_abandoned') > 0) {
            updateStats();
        }

        // Toggle start screen cards
        document.querySelectorAll('.logo .card').forEach(
            (element) => {
                            if(!element.classList.contains('twist'))
                                element.addEventListener('click', toggleCards);
                            });

    function startCurrentGame (eo) {
        eo = eo || window.event;

        switchToState('Game');

        currentGameState.currentGameAudio = new Audio('sounds/simple-funny-background-music-intro.mp3');
        soundInit(currentGameState.currentGameAudio);
        playSound(currentGameState.currentGameAudio);

        window.addEventListener("beforeunload", beforeUnload);

        currentGameState.matchCardsSound = new Audio("sounds/funny-boing-sound-effect.mp3");
        soundInit(currentGameState.matchCardsSound);

        currentGameState.winGameSound = new Audio("sounds/funny-blowing-trumpet-sound-effect.mp3");
        soundInit(currentGameState.winGameSound);

        increaseScore('flip_abandoned');

        document.querySelector('.info').style.display = 'none';

        let difficulty = '',
            timer = 1000,
            level = parseInt(eo.currentTarget.dataset.level);

        // Set game timer and difficulty
        if (level === 8) {
            difficulty = 'casual';
            timer *= level * 6;
        } else if (level === 18) {
            difficulty = 'medium';
            timer *= level * 6;
        } else if (level === 32) {
            difficulty = 'hard';
            timer *= level * 6;
        }

        document.getElementById('g').className += difficulty;
        document.querySelector('.logo').style.display = 'none';

        let startGame = Date.now(),
            cards = [];

        // Create and add shuffled cards to game
        for (let i = 0; i < level; i++) {
            cards.push(i);
        }

        let shuffled = shuffle([...cards, ...cards]);
        let defaultCardSize = 100 / Math.sqrt(shuffled.length) - 1;


        let gameElement = document.getElementById('g');

        // Detect orientation change
        let units = window.innerWidth > window.innerHeight ? "vh" : "vw";

        for (let i = 0; i < shuffled.length; i++) {
            let code = shuffled[i];
            if (code < 10)
                code = "0" + code;
            if (code === 30)
                code = 10;
            if (code === 31)
                code = 21;

            gameElement.innerHTML +=
                '<div class="card" style="width:' + defaultCardSize + units +';height:' + defaultCardSize + units +'">' +
                    '<div class="flipper">' +
                        '<div class="f"></div>' +
                        '<div class="b" data-f="&#xf0' + code + ';"></div>' +
                    '</div>' +
                '</div>';
         }
        
        // Set card actions
        let elements = document.querySelectorAll('#g .card');
        
        for (let element = 0; element < elements.length; element++) {
            elements[element].addEventListener('mousedown', cardAction);
        }
        function cardAction (eo) {
            eo = eo || window.event;
            let gameElement = document.getElementById('g');
            if (parseInt(gameElement.getAttribute('data-paused')) === 1) {
                return;
            }
            eo.currentTarget.classList.toggle('active');
            let data = eo.currentTarget.querySelector('div.b').getAttribute('data-f');

            let check = gameElement.querySelectorAll('div.card.active').length;
            if (check > 1) {
                setTimeout(function () {
                    let thisCards = gameElement.querySelectorAll('.active .b[data-f=' + data + ']');

                    if (thisCards.length > 1) {
                        currentGameState.matchCardsSound.play();
                        thisCards = document.querySelectorAll('div.card.active');
                        for (const thisCard of thisCards) {
                            let result = true;
                            for (const value of thisCard.classList) {
                                if(value === 'twist')
                                    result = false;
                            }
                            if(result){
                                thisCard.classList.add('found');
                                thisCard.classList.remove('active');
                                thisCard.classList.remove('card');
                                thisCard.innerHTML = '';
                            }
                        }
                        check = 0;
                        increaseScore('flip_matched');

                        // Win game
                        if (!document.querySelector('#g .card')) {
                            let time = Date.now() - startGame;
                            if (getValue('flip_' + difficulty) === '-:-' || getValue('flip_' + difficulty) > time) {
                                // increase best score
                                setLocalStorage('flip_' + difficulty, time);
                            }

                            currentGameState.startScreenText = 'cool'
                            gameEnd();
                            currentGameState.winGameSound.play();
                        }
                    }
                    else {
                        thisCards =  document.querySelectorAll('#g .card.active');
                        for (const thisCard of thisCards) {
                            thisCard.classList.remove('active');
                        }
                        increaseScore('flip_wrong');
                    }
                }, 401);
            }
        }

        let elem = document.createElement('i');
        elem.className += 'timer';
        elem.style.animation = 'timer ' + timer + 'ms linear';
        currentGameState.startScreenText = 'oops';
        elem.addEventListener('animationend', switchToMain);

        document.getElementById('g').prepend(elem);
        
        //pause & emergency exit
        document.addEventListener('keyup' , pauseEsc);

        currentGameState.touchStart = null;

        //pause with touches & swipes left/right
        window.addEventListener('touchstart', handelTouches);
        window.addEventListener('touchend', touchEnd);
    }

    function toggleCards(eo){
        eo = eo || window.event;

        let currentElement = eo.currentTarget;

        let siblings = currentElement.parentNode.children;
        for(let sibling = 0; sibling < siblings.length; sibling++){
            let result = JSON.stringify(siblings[sibling].classList) === JSON.stringify(currentElement.classList);
            let res1 = siblings[sibling].classList.contains('twist');
            if( !result){
                if(!res1)
                    siblings[sibling].classList.remove('active');
            }
        }

        eo.currentTarget.classList.toggle('active');
    }

    let elements = document.getElementsByClassName('play');
    for (let element = 0; element < elements.length; element++) {
        elements[element].addEventListener('click', startCurrentGame);
    }

    function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    function beforeUnload(event) {
        event.returnValue = "Data will be lost";
    }

    function switchToState(newState) {
        location.hash = newState;
    }

    function switchToStateFromURLHash(){
        let URLHash=window.location.hash;
        let stateStr = URLHash.substr(1);

        if ( stateStr === "" )
            stateStr ='Main';

        switch (stateStr) {
            case 'Main':
                gameEnd();
                break;
            case 'Game':
                break;
        }
    }

    function startScreen(text) {
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
    
    function gameEnd() {
        startScreen(currentGameState.startScreenText);

        window.removeEventListener("beforeunload", beforeUnload);
        window.removeEventListener('touchstart', handelTouches);
        window.removeEventListener('touchend', touchEnd);
        
        currentGameState.currentGameAudio.pause();
        let elem = document.querySelector('i')

        elem.removeEventListener('animationend', switchToMain);

        if (parseInt(document.body.getAttribute('data-paused')) === 1) { //was paused, now resume
            document.body.setAttribute('data-paused', '0');

            let elem = document.body;
            elem.removeChild(document.querySelector('div.pause'));
        }
    }

    function touchEnd(eo){
        let offset = 100; //at least 100px are a swipe
        if(currentGameState.touchStart){
            //the only finger that hit the screen left it
            let end = eo.changedTouches[0].screenX;

            if(end > currentGameState.touchStart + offset){
                pauseScreenSwitcher();
                //a left -> right swipe
            }
            if(end < currentGameState.touchStart - offset ){
                switchToState('Main');
                //a right -> left swipe
            }
        }
    }

    function pauseScreenSwitcher(){
        if (parseInt(document.body.getAttribute('data-paused')) === 1) { //was paused, now resume
            currentGameState.currentGameAudio.play();

            document.body.setAttribute('data-paused', '0');
            document.querySelector('.timer').style.animationPlayState = 'running';

            let elem = document.body;
            elem.removeChild(document.querySelector('div.pause'));
        }
        else {
            currentGameState.currentGameAudio.pause();

            document.body.setAttribute('data-paused', '1');
            document.querySelector('.timer').style.animationPlayState = 'paused';

            let elem = document.createElement('div');
            elem.className += 'pause';
            document.body.appendChild(elem);
        }
    }

    function handelTouches(eo){
        eo = eo || window.event;

        if(eo.targetTouches.length === 2){
            pauseScreenSwitcher();
        }

        if(eo.touches.length === 1){
            //just one finger touched
            currentGameState.touchStart = eo.touches[0].screenX;
        }else{
            //a second finger hit the screen, abort the touch
            currentGameState.touchStart = null;
        }

    }

    function pauseEsc (eo) {
        eo = eo || window.event;

        if (eo.key === 'p') {
            pauseScreenSwitcher();
        }

        if (eo.key === 'Escape') {
            currentGameState.startScreenText = 'main';
            switchToState('Main');
        }
    }

    function switchToMain(){
        switchToState('Main');
    }
}



