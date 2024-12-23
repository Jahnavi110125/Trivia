let playerName1;
let playerName2;
const loginPage = document.getElementById('login');
const categoriesPage = document.getElementById('categorySection');
const categoriesSection = document.getElementById('categories');
const questionsPage = document.getElementById('questionSection')
const questionSection = document.getElementById('questions');
const turnMsg = document.getElementById('turn');
const scorePage = document.getElementById('score');
const startButton = document.getElementById('start');
const winnerPage = document.getElementById('winner');
let questionNumber = 0;
let questionsArray;
let playerScore1 = 0;
let playerScore2 = 0;
let player1Wins = 0;
let player2Wins = 0;
let selectedCategories = [];
startButton.addEventListener('click', function(e){
    e.preventDefault()
    playerName1 = document.getElementById('name1').value || "Player1"; 
    playerName2 = document.getElementById('name2').value || "Player2";
    loginPage.style.display = 'none';
    categoriesPage.style.display = 'flex';
});

const apiurl = 'https://the-trivia-api.com/v2/categories';
fetch(apiurl).then(response =>{
    if(!response.ok){
        throw new Error('HTTP error!');
    }
    return response.json();
}).then(data =>{
    for(const category in data){
        const catDiv = document.createElement('div')
        catDiv.textContent = category;
        catDiv.classList.add('category');
        categoriesSection.appendChild(catDiv);

        catDiv.addEventListener('click', function(){
            categoriesPage.style.display = 'none';
            const selected = category;
            selectedCategories.push(category);
            retriveQuestions(selected);
        }); 
    }
}).catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});

function retriveQuestions(selected){
    questionsArray = [];
    questionNumber = 0;
    const dificultyLevel = ['easy', 'medium', 'hard']; 
    const limit = 2;
    const requests = dificultyLevel.map(difficulty => {
        const questionUrl = `https://the-trivia-api.com/v2/questions?categories=${selected}&limit=${limit}&difficulties=${difficulty}`;
        return fetch(questionUrl).then(response =>{
            if(!response.ok){
                throw new Error('HTTP error!');
            }
            return response.json();
        }).catch(error =>{
            console.log(error);
        });
    });
    Promise.all(requests).then(result =>{
        questionsArray = result;
        questionsArray = questionsArray.flat();
        displayQuestions(questionNumber);
    }).catch(error => {
        console.error('Error',error);
    });
};

function displayQuestions(questionNumber){
    questionSection.innerHTML = '';
    questionsPage.style.display = 'flex';
    scorePage.innerHTML = '';

    if(questionNumber < 0 || questionNumber >= questionsArray.length){
        questionsPage.style.display = 'none';
        scorePage.style.display = 'block';
        turnMsg.style.display = 'none';

        subhead = document.createElement('h3');
        subhead.textContent = "Well Done!";
        scoreMsg1 = document.createElement('p');
        scoreMsg1.classList.add('playerScores');
        scoreMsg1.textContent = `${playerName1} score : ${playerScore1}`;
        scoreMsg2 = document.createElement('p');
        scoreMsg2.classList.add('playerScores');
        scoreMsg2.textContent = `${playerName2} score : ${playerScore2}`;

        scorePage.appendChild(subhead);
        scorePage.appendChild(scoreMsg1);
        scorePage.appendChild(scoreMsg2);

        twoButtons = document.createElement('div');
        twoButtons.classList.add('buttons');
        buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('backExit');
        backButton = document.createElement('button');
        backButton.textContent = "Back";
        buttonsDiv.appendChild(backButton);

        exitButton = document.createElement('button');
        exitButton.textContent = "Exit";
        buttonsDiv.appendChild(exitButton);

        twoButtons.appendChild(buttonsDiv);
        scorePage.appendChild(twoButtons);

        if(selectedCategories.length == 10){
            backButton.disabled = true;
            backButton.style.pointerEvents = 'none';
        }

        backButton.addEventListener('click', function(){
            scorePage.style.display = 'none';
            questionsPage.style.display = 'none';
            categoriesPage.style.display = 'block';
            questionNumber = 0;
            questionsArray = [];
            questionSection.innerHTML = '';
            turnMsg.style.display = 'flex';

            if(playerScore1 > playerScore2){
                player1Wins += 1;
            }
            if(playerScore1 < playerScore2){
                player2Wins += 1;
            }
            playerScore1 = 0;
            playerScore2 = 0;
         
            const allCategories =  document.querySelectorAll('.category');
            allCategories.forEach(ele =>{
                const categoryName = ele.textContent;
                selectedCategories.forEach(ele1 =>{
                    if(categoryName === ele1){
                        ele.style.display = 'none';
                    }
                });
            });
        });

        exitButton.addEventListener('click', function(){
            if(playerScore1 > playerScore2){
                player1Wins += 1;
            }
            if(playerScore1 < playerScore2){
                player2Wins += 1;
            }

            wish  = document.createElement('h3');
            wish.textContent = "Congratulations!!";

            winMsg = document.createElement('p');
            winMsg.classList.add('winnerMsg');

            p1 = document.createElement('p')
            p1.classList.add('playerMsg');

            p2 = document.createElement('p');
            p2.classList.add('playerMsg');

            winnerPage.appendChild(wish);
            winnerPage.appendChild(winMsg);
            winnerPage.appendChild(p1);
            winnerPage.appendChild(p2);

            scorePage.style.display = 'none';

            if(player1Wins > player2Wins){
               winMsg.textContent = `${playerName1} won!!`;
               p1.textContent = `${playerName1}, Hurray!! You played well!!`;
               p2.textContent = `${playerName2}, No worries! You have to explore more!!`;
            }
            else if(player2Wins > player1Wins){
                winMsg.textContent = `${playerName2} won!!`;
                p1.textContent = `${playerName2}, Hurray!! You played well!!`;
                p2.textContent = `${playerName1}, No worries! You have to explore more!!`;
            }
            else{
                winMsg.textContent = `Oops!! It's a Tie!!`;
                p1.textContent = "You both have same knowledge!!";
                p2.textContent = "Keep working together!"
            }
        });
        return;
    }

    let element = questionsArray[questionNumber];
    if (!element) {
        console.error('Question object is undefined at index:', questionNumber);
        return;
    }


    const questionArea = document.createElement('div');
    questionArea.classList.add('questionArea');
    let questionText = element.question.text;
    let difficultyText = element.difficulty;
    let wholeQuestion = document.createElement('div');
    wholeQuestion.textContent = `[${difficultyText}] ${questionText}`;
    
    questionArea.append(wholeQuestion)
    questionSection.append(questionArea);

    const options = [...element.incorrectAnswers, element.correctAnswer]
    shuffleOptions(options);
    const optionsList = document.createElement('ul')
    options.forEach(op =>{
        const optionText = document.createElement('li');
        optionText.textContent = op;
        optionText.addEventListener('click', function(){
            verifyAnswer(op, element.correctAnswer);
        });
        optionsList.appendChild(optionText);
        
    });
    questionSection.appendChild(optionsList);
    turnMsg.textContent = (questionNumber % 2 == 0) ? `It's a ${playerName1} turn!` : `It's a ${playerName2} turn!`
}

function verifyAnswer(selectedop, correctAnswer){
    if(selectedop === correctAnswer){
        if(turnMsg.textContent === `It's a ${playerName1} turn!`){
            playerScore1++;
        }
        else{
            playerScore2++;
        }
    }
    else{
        alert("Not Correct!");
    }
    questionNumber++;
    displayQuestions(questionNumber)
}

function shuffleOptions(options){
    for(let i = 0 ; i < options.length; i++){
        let randomNumber = Math.random();
        let j = Math.floor(randomNumber * (i+1));
      [options[i],options[j]] = [options[j],options[i]];
    }
}