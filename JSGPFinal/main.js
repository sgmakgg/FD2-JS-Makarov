import {soundInit, playSound} from './sounds.js';
import {DefaultAppState} from './classes.js'
import {
    readStatistic,
    updateStats,
    gameStatistic,
    updateStatistic
} from './ajax.js';

document.addEventListener('DOMContentLoaded', memoGame);
function memoGame() {
    readStatistic();

    if ("ontouchstart" in window)
        document.querySelector('#touches').innerHTML = 'Touches are supporting';

    let currentGameState = {
        pageName: '',
        previousPageName: '',
        startScreenText: 'memo',
        difficulty: '',
        timer: 1000,
        level: 0,
        touchStart: null,
        startGame: null,
        hasDataLostConfirmed: false
    };

    currentGameState.currentGameAudio = new Audio('sounds/simple-funny-background-music-intro.mp3');
    soundInit(currentGameState.currentGameAudio);

    currentGameState.matchCardsSound = new Audio("sounds/funny-boing-sound-effect.mp3");
    soundInit(currentGameState.matchCardsSound);

    currentGameState.winGameSound = new Audio("sounds/funny-blowing-trumpet-sound-effect.mp3");
    soundInit(currentGameState.winGameSound);

    switchToStateFromURLHash();
    window.onhashchange = switchToStateFromURLHash;

    // Toggle start screen cards
    document.querySelectorAll('.logo .card').forEach(
        (element) => {
                        if(!element.classList.contains('twist'))
                            element.addEventListener('click', toggleCards);
                        });



    let elements = document.getElementsByClassName('play');
    for (let element = 0; element < elements.length; element++) {
        elements[element].addEventListener('click', startCurrentGame);
    }

    function startCurrentGame (eo) {
        eo = eo || window.event;

        setDefaultGameObject();

        gameStatistic.abandoned.value++;

        document.querySelector('.info').style.display = 'none';

        currentGameState.level = parseInt(eo.currentTarget.dataset.level);

        // Set game timer and difficulty
        if (currentGameState.level === 8) {
            currentGameState.difficulty = 'casual';
            currentGameState.timer *= (currentGameState.level * 6);
        }
        else if (currentGameState.level === 18) {
            currentGameState.difficulty = 'medium';
            currentGameState.timer *= (currentGameState.level * 6);
        }
        else if (currentGameState.level === 32) {
            currentGameState.difficulty = 'hard';
            currentGameState.timer *= (currentGameState.level * 6);
        }

        switchToGame({pageName: 'Game',
            level: currentGameState.level,
            difficulty: currentGameState.difficulty,
            timer: currentGameState.timer});
    }

    function toggleCards(eo){
        eo = eo || window.event;

        let currentElement = eo.currentTarget;

        if (this.id === 'statistic' &&
            (currentGameState.pageName === 'Main' || currentGameState.pageName === 'Rules')){
            switchToStatistic();
        }
        else if(this.id === 'statistic' && currentGameState.pageName === 'Statistic'){
            currentGameState.previousPageName = currentGameState.pageName;
            switchToMain();
        }
        else if(this.id === 'rules' &&
            (currentGameState.pageName === 'Main' || currentGameState.pageName === 'Statistic')){
            switchToRules();
        }
        else if(this.id === 'rules' && currentGameState.pageName === 'Rules'){
            currentGameState.previousPageName = currentGameState.pageName;
            switchToMain();
        }
        else if(this.id === 'choice' && currentGameState.previousPageName !== 'Choice'){
            switchToChoice();
        }
        else if(this.id === 'statistic' && currentGameState.previousPageName === 'Choice'){
            currentGameState.previousPageName = '';
            activeClassSwitcher(document.querySelector('div#choice.card.active'));
            switchToStatistic();
        }
        else if(this.id === 'rules' && currentGameState.previousPageName === 'Choice'){
            currentGameState.previousPageName = '';
            activeClassSwitcher(document.querySelector('div#choice.card.active'));
            switchToRules();
        }
        else{
            if(currentGameState.previousPageName === 'Choice'){
                currentGameState.previousPageName = '';
            }
            activeClassSwitcher(currentElement);
        }
    }

    function activeClassSwitcher(element){
        let siblings = element.parentNode.children;
        for(let sibling = 0; sibling < siblings.length; sibling++){
            let result = JSON.stringify(siblings[sibling].classList) === JSON.stringify(element.classList);
            let res1 = siblings[sibling].classList.contains('twist');
            if( !result){
                if(!res1)
                    siblings[sibling].classList.remove('active');
            }
        }

        element.classList.toggle('active');
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

    function beforeUnload(eo) {
        if(currentGameState.pageName === "Game")
            eo.returnValue = "Data will be lost";
    }

    function switchToState(newState) {
        location.hash = encodeURIComponent(JSON.stringify(newState));
    }

    function switchToMain(){
        switchToState({pageName: 'Main'});
    }

    function switchToGame(currentGameState) {
        switchToState( currentGameState );
    }

    function switchToStatistic(){
        switchToState({pageName: 'Statistic'});
    }
    function switchToChoice(){
        switchToState({pageName: 'Choice'});
    }

    function switchToRules(){
        switchToState({pageName: 'Rules'});
    }

    function switchToStateFromURLHash(){
        if(currentGameState.pageName === 'Game' && !currentGameState.hasDataLostConfirmed)
            alert('Current game data has been lost.')
        
        currentGameState.hasDataLostConfirmed = false;

        let URLHash=window.location.hash;
        let spaStateJson = decodeURIComponent(URLHash.substr(1));

        if ( spaStateJson !== "" ){
            let parsed = JSON.parse(spaStateJson);
            for (const parsedKey in parsed) {
                if(parsedKey in currentGameState){
                    currentGameState[parsedKey] = parsed[parsedKey];
                }
            }
        }
        else
            currentGameState.pageName ='Main';

        switch (currentGameState.pageName) {
            case 'Main':
                if(currentGameState.previousPageName === 'Statistic'){
                    currentGameState.previousPageName = '';
                    activeClassSwitcher(document.querySelector('div#statistic.card.left.active'));
                }
                if (currentGameState.previousPageName === 'Rules'){
                    currentGameState.previousPageName = '';
                    activeClassSwitcher(document.querySelector('div#rules.card.left.active'));
                }
                if (currentGameState.previousPageName === 'Choice'){
                    currentGameState.previousPageName = '';
                    activeClassSwitcher(document.querySelector('div#choice.card.active'));
                }
                gameEnd();
                break;
            case 'Game':
                setGameField();
                break;
            case 'Statistic':
                if(currentGameState)
                    activeClassSwitcher(document.querySelector('div#statistic.card.left'));
                break;
            case 'Rules':
                activeClassSwitcher(document.querySelector('div#rules.card.left'));
                break;
            case 'Choice':
                currentGameState.previousPageName = 'Choice';
                gameEnd();
                activeClassSwitcher(document.querySelector('div#choice.card'));
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
            gameStatistic.won.value++;
            gameStatistic.abandoned.value--;
            updateStatistic();
        }

        // If lost game
        else if (text === 'oops') {
            gameStatistic.lost.value++;
            gameStatistic.abandoned.value--;
            updateStatistic();
        }

        else if (text === 'main') {
            updateStatistic();
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
                currentGameState.hasDataLostConfirmed = confirm("Current game data will be lost.");
                if(currentGameState.hasDataLostConfirmed){
                    currentGameState.startScreenText = 'main';
                    switchToMain();
                }
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
        }
        else{
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
            currentGameState.hasDataLostConfirmed = confirm("Current game data will be lost.");
            if(currentGameState.hasDataLostConfirmed){
                currentGameState.startScreenText = 'main';
                switchToMain();
            }
        }
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
                    gameStatistic.matched.value++;

                    // Win game
                    if (!document.querySelector('#g .card')) {
                        let time = Date.now() - currentGameState.startGame;

                        if (gameStatistic[currentGameState.difficulty].value === '-:-'
                            || gameStatistic[currentGameState.difficulty].value > time) {
                            // increase best score
                            gameStatistic[currentGameState.difficulty].value = time;
                        }

                        currentGameState.startScreenText = 'cool'
                        currentGameState.hasDataLostConfirmed = true;
                        switchToMain();
                        currentGameState.winGameSound.play();
                    }
                }
                else {
                    thisCards =  document.querySelectorAll('#g .card.active');
                    for (const thisCard of thisCards) {
                        thisCard.classList.remove('active');
                    }

                    gameStatistic.wrong.value++;
                }
            }, 401);
        }
    }

    function setDefaultGameObject(){
        let defaultState = new DefaultAppState();
        currentGameState.timer = defaultState.defaultTimer;
        currentGameState.startScreenText = defaultState.defaultStartScreenText;
        currentGameState.level = defaultState.defaultLevel;
        currentGameState.difficulty = defaultState.defaultDifficulty;
    }

    function setGameField(){
        window.addEventListener("beforeunload", beforeUnload);

        //pause & emergency exit
        document.addEventListener('keyup' , pauseEsc);

        //pause with touches & swipes left/right
        window.addEventListener('touchstart', handelTouches);
        window.addEventListener('touchend', touchEnd);
        
        playSound(currentGameState.currentGameAudio);

        document.getElementById('g').className += currentGameState.difficulty;
        document.querySelector('.logo').style.display = 'none';

        currentGameState.startGame = Date.now();
        let cards = [];

        // Create and add shuffled cards to game
        for (let i = 0; i < currentGameState.level; i++) {
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

        let elem = document.createElement('i');
        elem.className += 'timer';
        elem.style.animation = 'timer ' + currentGameState.timer + 'ms linear';
        currentGameState.startScreenText = 'oops';
        elem.addEventListener('animationend', switchToMain);

        document.getElementById('g').prepend(elem);
    }
}



