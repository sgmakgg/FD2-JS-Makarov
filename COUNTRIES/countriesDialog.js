"use strict"
var countrysH={};

addCountry('Germany','Berlin');
addCountry('Hungary','Budapest');
addCountry('France','Paris');

function addCountry(countryName,capitalName) {
    countrysH[countryName]=capitalName;
}

function countryRequest() {

    var countryName, capitalName;
    var addMorePairs = true;
    do{
        countryName = prompt("Enter country name:");
        capitalName = prompt("Enter capital city name:")

        addCountry(countryName, capitalName);

        addMorePairs = confirm("Would you like enter more?");
    }while(addMorePairs);
}

function countryResponse() {
    var countryName = prompt("Enter country name:");

    getCountryInfo(countryName);
}

function getCountryInfo(countryName) {
    if ( countryName in countrysH )
        alert('Country: ' + countryName + ' Capital city: ' + countrysH[countryName]);
    else
        alert('List has no information' + countryName + '!');
}

function getListCountrys() {
    for ( var countryName in countrysH )
            console.log('Country: ' + countryName + ' Capital: ' + countrysH[countryName] );
}

function deleteCountry(countryName)
{
    delete countrysH[countryName];
}

function deleteCountryRequest(){
    var countryName = prompt("Enter country name:");
    deleteCountry(countryName);
}

