document.addEventListener('DOMContentLoaded', memoGame);
function memoGame() {
        function setLocalStorage(key, value) {
            localStorage.setItem(key, value);
        }

        function getValue(key) {
            return localStorage.getItem(key);
        }

        function increaseScore(key) {
            setLocalStorage(key, parseInt(getValue(key)) + 1);
        }

        function decreaseScore(key) {
            setLocalStorage(key, parseInt(getValue(key)) - 1);
        }

        let toTime = function (value) {
            if (value === '-:-')
                return value;
            else {
                let time = ' ' + value / 1000 + ' ';
                return time.substr(0, time.length - 1) + 's';
            }
        };

        function updateStats() {
            document.getElementById('stats').innerHTML = '' +
                '<div class="padded">' +
                        '<h2>Figures: <span>' + '<b>' + getValue('flip_won') + '</b><i>Won</i>' +
                        '<b>' + getValue('flip_lost') + '</b><i>Lost</i>' +
                        '<b>' + getValue('flip_abandoned') + '</b><i>Abandoned</i></span>' +
                        '</h2>' +
                    '<ul>' +
                        '<li>' +
                        '<b>Best Casual:</b> <span>' + toTime(getValue('flip_casual')) + '</span>' +
                        '</li>' +
                        '<li>' +
                        '<b>Best Medium:</b> <span>' + toTime(getValue('flip_medium')) + '</span>' +
                        '</li>' +
                        '<li>' +
                        '<b>Best Hard:</b> <span>' + toTime(getValue('flip_hard')) + '</span>' +
                        '</li>' +
                    '</ul>' +
                    '<ul>' +
                        '<li>' +
                        '<b>Total Flips:</b> <span>' + parseInt((parseInt(getValue('flip_matched'))
                                                    + parseInt(getValue('flip_wrong'))) * 2) + '</span>' +
                        '</li>' +
                        '<li>' +
                        '<b>Matched Flips:</b> <span>' + getValue('flip_matched') + '</span>' +
                        '</li>' +
                        '<li>' +
                        '<b>Wrong Flips:</b> <span>' + getValue('flip_wrong') + '</span>' +
                        '</li>' +
                    '</ul>' +
                '</div>';
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

    function startCurrentGame (eo) {
        eo = eo || window.event;

        let currentGameAudio = new Audio('sounds/simple-funny-background-music-intro.mp3');
        soundInit(currentGameAudio);
        playSound(currentGameAudio);

        let pairCardSound = new Audio("sounds/funny-boing-sound-effect.mp3");
        soundInit(pairCardSound);

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

        let shuffled = shuffle([...cards, ...cards]),
            cardSize = 100 / Math.sqrt(shuffled.length);


        let gameElement = document.getElementById('g');
        for (let i = 0; i < shuffled.length; i++) {
            let code = shuffled[i];
            if (code < 10)
                code = "0" + code;
            if (code === 30)
                code = 10;
            if (code === 31)
                code = 21;

            gameElement.innerHTML +=
                '<div class="card" style="width:' + cardSize + '%;height:' + cardSize + '%;">' +
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
                        pairCardSound.play();
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

        elem.addEventListener('animationend', function timerFunction() {
            startScreen('oops');
            currentGameAudio.pause();
            elem.removeEventListener('animationend', timerFunction);
        });

        document.getElementById('g').prepend(elem);


        //pause & emergency exit
        document.addEventListener('keyup' , pauseEsc);
        document.addEventListener('swipeLeft' , pauseEsc);

        function pauseEsc (eo) {
            if (eo.key === 'p') {
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

            if (eo.key === 'Escape' || eo.type === 'swipeLeft') {
                debugger
                window.close();
            }
        }

        function soundInit(sound) {
            sound.play();
            sound.pause();
        }

        function playSound(sound) {
            sound.currentTime = 0;
            sound.play();
            sound.loop = true;
            sound.volume = 0.2;
        }
    }
}
