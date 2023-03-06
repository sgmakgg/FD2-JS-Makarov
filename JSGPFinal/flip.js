document.addEventListener('DOMContentLoaded', memoGame);
function memoGame() {
        function setLocalStorage(key, value) {
            localStorage.setItem(key, value);
        }

        function get(key) {
            return localStorage.getItem(key);
        }

        function increase(key) {
            setLocalStorage(key, parseInt(get(key)) + 1);
        }

        function decrease(key) {
            setLocalStorage(key, parseInt(get(key)) - 1);
        }

        let toTime = function (nr) {
            if (nr === '-:-') return nr;
            else {
                let n = ' ' + nr / 1000 + ' ';
                return n.substr(0, n.length - 1) + 's';
            }
        };

        function updateStats() {
            document.getElementById('stats').innerHTML = '' +
                '<div class="padded">' +
                        '<h2>Figures: <span>' + '<b>' + get('flip_won') + '</b><i>Won</i>' +
                        '<b>' + get('flip_lost') + '</b><i>Lost</i>' +
                        '<b>' + get('flip_abandoned') + '</b><i>Abandoned</i></span>' +
                        '</h2>' +
                    '<ul>' +
                        '<li>' +
                        '<b>Best Casual:</b> <span>' + toTime(get('flip_casual')) + '</span>' +
                        '</li>' +
                        '<li>' +
                        '<b>Best Medium:</b> <span>' + toTime(get('flip_medium')) + '</span>' +
                        '</li>' +
                        '<li>' +
                        '<b>Best Hard:</b> <span>' + toTime(get('flip_hard')) + '</span>' +
                        '</li>' +
                    '</ul>' +
                    '<ul>' +
                        '<li>' +
                        '<b>Total Flips:</b> <span>' + parseInt((parseInt(get('flip_matched')) + parseInt(get('flip_wrong'))) * 2) + '</span>' +
                        '</li>' +
                        '<li>' +
                        '<b>Matched Flips:</b> <span>' + get('flip_matched') + '</span>' +
                        '</li>' +
                        '<li>' +
                        '<b>Wrong Flips:</b> <span>' + get('flip_wrong') + '</span>' +
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
            if (text === 'nice') {
                increase('flip_won');
                decrease('flip_abandoned');
            }

            // If lost game
            else if (text === 'fail') {
                increase('flip_lost');
                decrease('flip_abandoned');
            }

            updateStats();
        }

        /* LOAD GAME ACTIONS */

        // Init localStorage
        if (!get('flip_won') && !get('flip_lost') && !get('flip_abandoned')) {
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
        if (get('flip_won') > 0 || get('flip_lost') > 0 || get('flip_abandoned') > 0) {
            updateStats();
        }

        // Toggle start screen cards
        document.querySelectorAll('.logo .card').forEach(
            (element) => {
                            if(!element.classList.contains('twist'))
                                element.addEventListener('click', switcher);
                            });

        function switcher(eo){
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
        increase('flip_abandoned');

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
            timer *= level * 5;
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
                        increase('flip_matched');

                        // Win game
                        if (!document.querySelector('#g .card')) {
                            let time = Date.now() - startGame;
                            if (get('flip_' + difficulty) === '-:-' || get('flip_' + difficulty) > time) {
                                setLocalStorage('flip_' + difficulty, time); // increase best score
                            }

                            startScreen('nice');
                        }
                    }
                    else {
                        thisCards =  document.querySelectorAll('#g .card.active');
                        for (const thisCard of thisCards) {
                            thisCard.classList.remove('active');
                        }

                        increase('flip_wrong');
                    }
                }, 401);
            }
            }

        let elem = document.createElement('i');
        elem.className += 'timer';
        elem.style.animation = 'timer ' + timer + 'ms linear';

        elem.addEventListener('animationend', function timerFunction() {
            startScreen('fail');
            elem.removeEventListener('animationend', timerFunction);
        });

        document.getElementById('g').prepend(elem);

        //pause & emergency exit
        window.addEventListener('keyup', function (eo) {

            if (eo.key === 'p') {
                if (parseInt(document.body.getAttribute('data-paused')) === 1) { //was paused, now resume
                    document.body.setAttribute('data-paused', '0');
                    document.querySelector('.timer').style.animationPlayState = 'running';

                    let elem = document.body;
                    elem.removeChild(document.querySelector('div.pause'));
                }
                else {
                    document.body.setAttribute('data-paused', '1');
                    document.querySelector('.timer').style.animationPlayState = 'paused';

                    let elem = document.createElement('div');
                    elem.className += 'pause';
                    document.body.appendChild(elem);
                }
            }

            if (eo.key === 'Escape') {
                window.close();
            }
        });
    }
}
