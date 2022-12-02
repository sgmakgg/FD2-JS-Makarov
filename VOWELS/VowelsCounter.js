    var answer = null;

    do {
        answer = prompt("Enter word or subject")
    } while (answer === null || answer.trim() === '');

    console.log(vowelsCounter(answer));



function vowelsCounter(text){
    var russianVowels = {'а': 0, 'у': 0, 'о': 0, 'ы':0, 'и':0, 'э':0, 'я':0, 'ю':0, 'ё':0, 'е':0};
    var summary = 0;
    var countedString = text.toLowerCase();

    for (let i = 0; i < countedString.length; i++) {
        if(countedString[i] in russianVowels){
            var temp = countedString[i];
            russianVowels[temp]++;
        }
    }
    
    for (const key in russianVowels) {
        summary += russianVowels[key];
    }
    return summary;
}


