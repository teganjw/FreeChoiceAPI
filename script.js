
var amount = "";
var category = "";
var difficulty = "";
var type = "";

$(document).ready(function () {
    $('#myButton').on('click', function(){
        document.getElementById("answers").style.display = 'inline';
        document.getElementById("all").style.display = 'none';
        amount = document.getElementById("numQuestions").value;
        category = document.getElementById("selectCategory").value;
        difficulty = document.getElementById("selectDifficulty").value;
        type = document.getElementById("selectType").value;

        $.ajax({
            url: "https://opentdb.com/api.php?amount=" + amount + "&category=" + category + "&difficulty=" + difficulty + "&type=" + type,
            type: 'GET',
            crossDomain: true,
            dataType: 'json',
            success: function(result) {
                console.log(result);
                myFunction(result) },
            error: function() { alert('Failed!'); }
        });

    });

    $('#grade').on('click', function(){
        document.getElementById("numQuestions").value = 10;
        document.getElementById("selectCategory").value = "";
        document.getElementById("selectDifficulty").value = "";
        document.getElementById("selectType").value = "";
        document.getElementById("display").style.display = 'inline';
        document.getElementById("message").style.display = 'inline';
        document.getElementById("table").style.display = 'inline';
        document.getElementById("answers").style.display = 'none';
        document.getElementById("grade").style.display = 'none';

        var guessedAnswers = [];
        for(var i=0; i<correctAnswers.length; i++){
            guessedAnswers.push($('input[name=q' + i + ']:checked').val())
        }
        console.log(guessedAnswers);

        var s = "<table border = '1'>";
        s+="What you got wrong:"
        s+= ("<tr><td>" + 'Question' + "</td>");
        s+= ("<td>" + 'Your Answer' + "</td>");
        s+= ("<td>" + 'Correct Answer' + "</td></tr>");
        var numCorrect = 0;
        for(var c=0; c<correctAnswers.length; c++){
            if(correctAnswers[c] == guessedAnswers[c]){
                numCorrect++
            }else{
                s+= ("<tr><td>" + trivia[c] + "</td>");
                if(guessedAnswers[c] == undefined){
                    s+= ("<td>" + "unanswered" + "</td>");
                }else{
                    s+= ("<td>" + guessedAnswers[c] + "</td>");
                }
                s+= ("<td>" + correctAnswers[c] + "</td></tr>");
            }
        }

        s += "</table>";
        document.getElementById("table").innerHTML = s;

        console.log(numCorrect);
        document.getElementById("display").innerHTML = "You got a " + numCorrect + "/10! That's a " + numCorrect/10 * 100 + "%";
        if((numCorrect)>=8){
            document.getElementById("message").innerHTML = "You are officially pretty good at this. Congratulations, you're on your way to being a Trivia genius!";
        }
        if((numCorrect)==10){
            document.getElementById("message").innerHTML = "You are a Trivia Master! Try another category to expand your knowledge...";
        }
        if((numCorrect)<8){
            document.getElementById("message").innerHTML = "Hmmm... maybe you should read up on your Trivia material...";
        }

        document.getElementById("startOver").style.display = 'inline';
    });

    $('#startOver').on('click', function () {
        correctAnswers = [];
        trivia = [];
        document.getElementById("table").style.display = 'none';
        document.getElementById("display").style.display = 'none';
        document.getElementById("message").style.display = 'none';
        document.getElementById("startOver").style.display = 'none';
        document.getElementById("answers").innerHTML = "";
        document.getElementById("all").style.display = 'inline';
    });
});

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
    console.log(array)
}

//stack overflow
function decodeHTMLEntities (str) {
    var element = document.createElement('div');
    if(str && typeof str === 'string') {
        // strip script/html tags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
        element.innerHTML = str;
        str = element.textContent;
        element.textContent = '';
    }

    return str;
}


var correctAnswers = [];
var trivia = [];
function myFunction(json){
    document.getElementById("all").style.display = 'none';
    var results = json.results;
    var answers = [];

    for(var i=0; i<results.length; i++) {
        var sAnswers = [];
        for (var a = 0; a < results[i].incorrect_answers.length; a++) {
            sAnswers.push(results[i].incorrect_answers[a]);
        }

        results[i].correct_answer = decodeHTMLEntities(results[i].correct_answer);
        correctAnswers.push(results[i].correct_answer);
        sAnswers.push(results[i].correct_answer);
        sAnswers = shuffle(sAnswers);
        answers.push(sAnswers);
        trivia.push(results[i].question);

    }
console.log(correctAnswers);
    var output = "";

        for(var b=0; b<results.length; b++){
            output += "<br>" + trivia[b] + "<br>";
            for(var e=0; e<answers[b].length; e++){
                var answerArray = answers[b];
                output += "<input type='radio' name='q" + b + "' value='" + answerArray[e] + "'> " +  answerArray[e]  + "<br>";

            }
        }

    $("#answers").append(output);
    document.getElementById("grade").style.display = 'inline';
}

