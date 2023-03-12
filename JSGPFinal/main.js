import {soundInit, playSound} from './sounds.js';
import {setLocalStorage, getValue, increaseScore, updateStats} from './statistic.js';
import {startScreen, switchToState, switchToStateFromURLHash} from './SPA.js';

document.addEventListener('DOMContentLoaded', memoGame);
function memoGame() {
        if ("ontouchstart" in window)
            document.querySelector('#touches').innerHTML = 'Touches are supporting';

        switchToState('Main');
        window.onhashchange = switchToStateFromURLHash;


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

        let currentGameAudio = new Audio('sounds/simple-funny-background-music-intro.mp3');
        soundInit(currentGameAudio);
        playSound(currentGameAudio);
        window.addEventListener("beforeunload", beforeUnload);

        let matchCardsSound = new Audio("sounds/funny-boing-sound-effect.mp3");
        soundInit(matchCardsSound);

        let winGameSound = new Audio("sounds/funny-blowing-trumpet-sound-effect.mp3");
        soundInit(winGameSound);

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
                        matchCardsSound.play();
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
                            startScreen('cool');
                            currentGameAudio.pause();
                            window.removeEventListener("beforeunload", beforeUnload);
                            winGameSound.play();
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

        function timerFunction() {
            startScreen('oops');
            window.removeEventListener("beforeunload", beforeUnload);
            currentGameAudio.pause();
            elem.removeEventListener('animationend', timerFunction);
        }

        elem.addEventListener('animationend', timerFunction);

        document.getElementById('g').prepend(elem);


        //pause & emergency exit
        document.addEventListener('keyup' , pauseEsc);
        let start = null;

        //pause with touches & swipes left/right
        window.addEventListener('touchstart', handelTouches);
        window.addEventListener('touchend', function(eo){
            let offset = 100; //at least 100px are a swipe
            if(start){
                //the only finger that hit the screen left it
                let end = eo.changedTouches[0].screenX;

                if(end > start + offset){
                    pauseScreenSwitcher();
                    //a left -> right swipe
                }
                if(end < start - offset ){
                    pauseScreenSwitcher();
                    //a right -> left swipe
                }
            }
        });

        function pauseEsc (eo) {
            eo = eo || window.event;

            if (eo.key === 'p') {
                pauseScreenSwitcher();
            }

            if (eo.key === 'Escape') {
                window.close();
            }
        }

        function handelTouches(eo){
            eo = eo || window.event;

            if(eo.targetTouches.length === 2){
                pauseScreenSwitcher();
            }

            if(eo.touches.length === 1){
                //just one finger touched
                start = eo.touches[0].screenX;
            }else{
                //a second finger hit the screen, abort the touch
                start = null;
            }

        }

        function pauseScreenSwitcher(){
            if (parseInt(document.body.getAttribute('data-paused')) === 1) { //was paused, now resume
                currentGameAudio.play();

                document.body.setAttribute('data-paused', '0');
                document.querySelector('.timer').style.animationPlayState = 'running';

                let elem = document.body;
                elem.removeChild(document.querySelector('div.pause'));
            }
            else {
                currentGameAudio.pause();

                document.body.setAttribute('data-paused', '1');
                document.querySelector('.timer').style.animationPlayState = 'paused';

                let elem = document.createElement('div');
                elem.className += 'pause';
                document.body.appendChild(elem);
            }
        }
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
}



