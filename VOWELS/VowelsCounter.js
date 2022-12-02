    var answer = null;

    do {
        answer = prompt("Enter word or subject")
    } while (answer === null || answer.trim() === '');

    console.log(vowelsCounter(answer));



function vowelsCounter(text){
    var russianVowels = ['а', 'у', 'о', 'ы', 'и', 'э', 'я', 'ю', 'ё', 'е'];
    var summary = 0;
    var countedString = text.toLowerCase();

    for (let i = 0; i < russianVowels.length; i++) {
        for (let j = 0; j < countedString.length; j++) {
            if(russianVowels[i] === countedString[j]){
                summary++;
                delete countedString[j];
            }
        }
    }
    return summary;
}


