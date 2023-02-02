'use strict'
const WRONG_VALIDATION_MESSAGE = 'Введите правильное значение!';
const NO_VALIDATION_MESSAGE = '';


function eventChecker(EO) {
    EO=EO||window.event;
    if(EO.type === 'submit'){
        let hasValidationError = submitValidation();
        if(hasValidationError)
            EO.preventDefault();
    }
    else
        formValidator(EO.currentTarget.id);
}

function addListenerToFormsElem(elementId, eventName){
    let elem = document.getElementById(elementId);
    elem.addEventListener(eventName, eventChecker, false);
}

function formValidator(formId){
    let validationError = false;
    switch (formId) {
        case 'DEV':
        case 'SN':
        case 'URL':
        case 'OPENED':
        case 'VISITORS':
        case 'EMAIL':
        case 'CATALOG':
        case 'REVIEW':
        case 'DESCRIPTION':
        {
            let elem = document.getElementById(formId);
            if(elem.value === '' || elem.value ==='1' || (elem.value === 'yes' && !elem.checked)){
                elem.querySelector('#'+ formId + '+ span').innerHTML = WRONG_VALIDATION_MESSAGE;
                validationError = true;
            }
            else
                elem.querySelector('#'+ formId + '+ span').innerHTML = NO_VALIDATION_MESSAGE;
            break;
        }

        case 'RADIOGROUP':{
            let radioGroup = document.getElementsByName('layout');
            if(!radioGroup[0].checked){
                let elem = document.getElementById(formId);
                elem.querySelector('#'+ formId + '+ span').innerHTML = WRONG_VALIDATION_MESSAGE;
                validationError = true;
            }
            else{
                let elem = document.getElementById(formId);
                elem.querySelector('#'+ formId + '+ span').innerHTML = NO_VALIDATION_MESSAGE;
            }
            break;
        }
    }

    return validationError;
}

function submitValidation(){
    formsParams.forEach(
        (item)=>item.validationError = formValidator(item.id));

    return focusOnElement();
}

function focusOnElement(){
    for (let i = 0; i < formsParams.length; i++) {
        if(formsParams[i].validationError === true){
            let elem = document.getElementById(formsParams[i].id);
            elem.focus();
            return true;
        }
    }
    return false;
}




