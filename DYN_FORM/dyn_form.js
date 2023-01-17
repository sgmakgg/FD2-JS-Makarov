'use strict'
function formBuilder(formData, formElement){

    for (let item of formData){
        const labelTag = document.createElement('label');
        const inputTag = document.createElement('input');
        const brTag = document.createElement('br');

        if (item.kind.localeCompare('longtext') === 0) {
            labelTag.innerHTML = item.label;
            inputTag.type = 'text';
            inputTag.name = item.name;

            formElement.appendChild(labelTag);
            formElement.appendChild(inputTag);
            formElement.appendChild(brTag);
        }

        else if (item.kind.localeCompare('number') === 0){
            labelTag.innerHTML = item.label;
            inputTag.type = 'number';
            inputTag.name = item.name;

            formElement.appendChild(labelTag);
            formElement.appendChild(inputTag);
            formElement.appendChild(brTag);
        }

        else if (item.kind.localeCompare('shorttext') === 0){
            labelTag.innerHTML = item.label;
            inputTag.type = 'email';
            inputTag.name = item.name;

            formElement.appendChild(labelTag);
            formElement.appendChild(inputTag);
            formElement.appendChild(brTag);
        }

        else if (item.kind.localeCompare('combo') === 0){
            let selectTag = document.createElement('select');

            labelTag.innerHTML = item.label;
            selectTag.name= item.name;

            item.variants.forEach(varElement =>{
                let optionTag = document.createElement('option');
                optionTag.text = varElement.text;
                optionTag.value = varElement.value;
                selectTag.appendChild(optionTag)
            })

            formElement.appendChild(labelTag);
            formElement.appendChild(selectTag);
            formElement.appendChild(brTag);
        }

        else if (item.kind.localeCompare('radio') === 0){
            labelTag.innerHTML = item.label;
            formElement.appendChild(labelTag);

            item.variants.forEach(varElement =>{
                let inputCheckBox = document.createElement('input');
                let labelCheckBox = document.createElement('label');

                inputCheckBox.type = 'radio';
                inputCheckBox.name = varElement.name;
                inputCheckBox.value = varElement.value;

                formElement.appendChild(inputCheckBox);
                labelCheckBox.innerHTML = varElement.text;
                formElement.appendChild(labelCheckBox);
            })

            formElement.appendChild(brTag);
        }

        else if (item.kind.localeCompare('check') === 0){
            labelTag.innerHTML = item.label;
            inputTag.type = 'checkbox';
            inputTag.name = item.name;

            formElement.appendChild(labelTag);
            formElement.appendChild(inputTag);
            formElement.appendChild(brTag);
        }

        else if (item.kind.localeCompare('memo') === 0){
            const pTag = document.createElement('p');
            pTag.innerHTML = item.label;
            formElement.appendChild(pTag);

            const textAreaTag = document.createElement('textarea');
            textAreaTag.name = item.name;
            formElement.appendChild(textAreaTag);
            formElement.appendChild(brTag);
        }

        else if (item.kind.localeCompare('submit') === 0){
            const buttonTag = document.createElement('button');
            buttonTag.innerHTML = item.caption;
            formElement.appendChild(buttonTag);
        }
    }
}