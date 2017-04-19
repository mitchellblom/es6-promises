// Use AJAX | Promises to load all 3 JSON files
// Iterate over all JSON files and match the human with their appropriate pet(s)
// ES6-ify it all!
// no more var (let for vars changed later in the code, const). let and const must be defined before referenced.
// fat arrow

$(document).ready(() => {

    const outputContainer = $("#output");

    const writeToDOM = (humanArray) => {
        let domString = "";
        for (let i = 0; i < humanArray.length; i++) {
            domString += `<div class="human row">`;
            domString += `<div class="col-sm-4">`;
            domString += `<img src="${humanArray[i].image}">`;
            domString += `<p>${humanArray[i].name}</p>`;
            domString += `</div>`;
            domString += `<div class="col-sm-8 overflow-row">`;
            for (let j = 0; j < humanArray[i].matches.length; j++) {
                domString += `<div class="animal">`;
                domString += `<img src="${humanArray[i].matches[j].image}">`;
                domString += `<p>${humanArray[i].matches[j].name}</p>`;
                domString += `<p>${humanArray[i].matches[j].description}</p>`;
                domString += `</div>`;
            }
            domString += `</div>`;
            domString += `</div>`;
        }
        outputContainer.append(domString);
    };

    const loadHumans = () => {
        return new Promise((resolve, reject) => {
            $.ajax("./database/humans.json")
                .done((data1) => {
                    resolve(data1.humans);
                })
                .done((data) => {
                    resolve(data.humans);
                })
                .fail((error) => reject(error));
        });
    };

    const loadCats = () => {
        return new Promise((resolve, reject) => {
            $.ajax("./database/cats.json")
                .done((data1) => {
                    resolve(data1.cats);
                })
                .fail((error) => {
                    reject(error);
                });
        });
    };

    const loadDogs = () => {
        return new Promise((resolve, reject) => {
            $.ajax("./database/dogs.json")
                .done((data1) => {
                    resolve(data1.dogs);
                })
                .fail((error) => {
                    reject(error);
                });
        });
    };

    const loadDinos = () => {
        return new Promise((resolve, reject) => {
            $.ajax("./database/dinos.json")
                .done((data1) => {
                    resolve(data1.dinos);
                })
                .fail((error) => {
                    reject(error);
                });
        });
    };

    const myHumans = []; // can be const because one can change what's inside but not the functionality
    const myAnimals = [];

    const checkForTypeMatch = (human, pet) => {
        const interestedInArray = human["interested-in"];
        const isMatchNumber = interestedInArray.indexOf(pet.type);
        if (isMatchNumber === -1) {
            return false;
        } else {
            return true; // will be either true or false
        }
    };

    const checkForKidFrendly = (human, pet) => {
        const hasKids = human["has-kids"];
        const isKidFriendly = pet["kid-friendly"];
        let isMatched = true;
        if (hasKids && !isKidFriendly) {
            isMatched = false;
        }
        return isMatched;
    };

    loadHumans().then((humans) => {
            // myHumans.push(humans)
            humans.forEach((human) => {
                human.matches = []; // adding a key on humans that is an empty array, to push matches that fit
                myHumans.push(human);
            });

            Promise.all([loadDogs(), loadCats(), loadDinos()])
                .then((result) => {
                    result.forEach((xhrResult) => {
                        xhrResult.forEach((animal) => {
                            myAnimals.push(animal);
                        });
                    });

                    for (let i = 0; i < myHumans.length; i++) {
                        for (let j = 0; j < myAnimals.length; j++) {
                            if (checkForTypeMatch(myHumans[i], myAnimals[j]) && checkForKidFrendly(myHumans[i], myAnimals[j])) {
                                myHumans[i].matches.push(myAnimals[j]);
                            }
                        }
                    }
                    writeToDOM(myHumans);
                })
                .catch((animalErrors) => {
                    console.log(animalErrors);
                });
        })
        .catch((humanError) => {
            console.log(humanError);
        });



    // hs -c-1 runs hs without cacheing issues



});