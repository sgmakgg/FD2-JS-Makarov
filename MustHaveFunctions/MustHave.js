/*
    Получение словоформы для числа

    function test() {
    const applesS=prompt('Сколько у вас яблок?');
    const apples=parseInt(applesS);
    alert( 'У вас ' + apples + ' ' + getNumWord(apples,'яблоко','яблока','яблок') + '!' );
}*/

function getNumWord(num,word1,word2,word5) {
    const dd=num%100;
    if ( (dd>=11) && (dd<=19) )
        return word5;
    const d=num%10;
    if ( d===1 )
        return word1;
    if ( (d>=2) && (d<=4) )
        return word2;
    return word5;
}

// округление до произвольного модуля
function roundMod(n,m) {
    return Math.round(n/m)*m;
}

// получение целого случайного числа в заданном диапазоне
function randomDiap(n,m) {
    return Math.floor(Math.random()*(m-n+1))+n;
}

// получение координат элемента относительно верхнего левого угла страницы
function getElementPos(elem) {
    var bbox=elem.getBoundingClientRect();
    return {
        left: bbox.left+window.pageXOffset,
        top: bbox.top+window.pageYOffset
    };
}

//Функция для получения реального имени класса объекта

function getClassName(obj) {
    if ( obj.constructor && obj.constructor.name )
        return obj.constructor.name;
    const c=Object.prototype.toString.apply(obj);
    return c.substring(8,c.length-1);
}

// форматирует дату-время в формате дд.мм.гггг чч:мм:сс
function formatDateTime(dt) {
    const year=dt.getFullYear();
    const month=dt.getMonth()+1;
    const day=dt.getDate();
    const hours=dt.getHours();
    const minutes=dt.getMinutes();
    const seconds=dt.getSeconds();
    return str0l(day,2) + '.' + str0l(month,2) + '.' + year + ' '
        + str0l(hours,2) + ':' + str0l(minutes,2) + ':' + str0l(seconds,2);
}

// дополняет строку val слева нулями до длины Len
function str0l(val,len) {
    let strVal=val.toString();
    while ( strVal.length < len )
        strVal='0'+strVal;
    return strVal;
}

// функция позволяет установить обработчик func,
// который не срабатывает слишком часто -
// если immediate=false - func будет вызван в конце серии событий,
// если immediate=true - func будет вызван в начале серии событий
// серия событий - последовательность событий,
// интервалы между которыми не превыщают interval миллисекунд
function debounceSerie(func,interval,immediate) {
    let timer;
    return function() {
        let context=this, args=arguments;
        let later=function() {
            timer=null;
            if ( !immediate )
                func.apply(context,args);
        };
        let callNow=immediate&&!timer;
        clearTimeout(timer);
        timer=setTimeout(later,interval);
        if ( callNow )
            func.apply(context,args);
    };
}

// возвращает размер открытого документа
function getDocumentSize() {
    var totalHeight=(document.body.scrollHeight > document.body.offsetHeight)?document.body.scrollHeight:document.body.offsetHeight;
    var totalWidth=(document.body.scrollWidth > document.body.offsetWidth)?document.body.scrollWidth:document.body.offsetWidth;
    return {width:totalWidth, height:totalHeight};
}

// возвращает размер клиентской области окна
function getWindowClientSize() {
    var uaB=navigator.userAgent.toLowerCase();
    var isOperaB = (uaB.indexOf('opera')  > -1);
    var isIEB=(!isOperaB && uaB.indexOf('msie') > -1);

    var clientWidth=((document.compatMode||isIEB)&&!isOperaB)?
        (document.compatMode=='CSS1Compat')?
            document.documentElement.clientWidth:
            document.body.clientWidth:
        (document.parentWindow||document.defaultView).innerWidth;

    var clientHeight=((document.compatMode||isIEB)&&!isOperaB)?
        (document.compatMode=='CSS1Compat')?
            document.documentElement.clientHeight:
            document.body.clientHeight:
        (document.parentWindow||document.defaultView).innerHeight;

    return {width:clientWidth, height:clientHeight};
}

// возвращает, насколько проскроллировано окно браузера
function getWindowScrollPos() {
    if ( 'pageXOffset' in window )
        return { scrollx: window.pageXOffset, scrolly: window.pageYOffset };
    if ( document.documentElement && ('scrollLeft' in document.documentElement) )
        return { scrollx: document.documentElement.scrollLeft, scrolly: document.documentElement.scrollTop };
    if ( document.body && ('scrollLeft' in document.body) )
        return { scrollx: document.body.scrollLeft, scrolly: document.body.scrollTop };
    return { scrollx: 0, scrolly: 0 };
}

// скроллирует окно к указанному элементу
function scrollToElem(elem,scrollMode) {
    // scrollMode:
    // 0 - сделать видимым с минимальным скроллингом
    // 1 - верх объекта - к верху экрана
    // 2 - объект на середину экрана
    // 3 - низ объекта - к низу экрана
    // 4 - верх объекта - почти к верху экрана

    var elemPos=getElementPos(elem);
    switch ( scrollMode ) {
        case 0:
            var scrollPos=getWindowScrollPos();
            if ( scrollPos.scrolly>elemPos.top )
                window.scrollTo(0,elemPos.top);
            else {
                var clientSize=getWindowClientSize();
                if ( elemPos.top+elem.offsetHeight>scrollPos.scrolly+clientSize.height )
                    window.scrollTo(0,elemPos.top+elem.offsetHeight-clientSize.height);
            }
            break;
        case 1:
            window.scrollTo(0,elemPos.top);
            break;
        case 2:
            var clientSize=getWindowClientSize();
            window.scrollTo(0,elemPos.top+elem.offsetHeight/2-clientSize.height/2);
            break;
        case 3:
            var clientSize=getWindowClientSize();
            window.scrollTo(0,elemPos.top+elem.offsetHeight-clientSize.height);
            break;
        case 4:
            var clientSize=getWindowClientSize();
            window.scrollTo(0,elemPos.top-clientSize.height/5);
            break;
    }
}
