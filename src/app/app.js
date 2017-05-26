var app = (function() {

  // Variables, assigned here just to indicate type
  var data = {};
  var qList = [];
  var aList = [];
  var qNum = 0;

  return {
    'welcomeLoad': welcomeLoad,
    'welcomeSelect': welcomeSelect,
    'quizSelect': quizSelect
  }

  function welcomeLoad() {

    // Show page
    showPage('welcome');

    // Get data and fill page in the success callback
    dataGet('quiz.json', dataSuccess, dataFail);

    // Success callback
    function dataSuccess(response) {
      data = JSON.parse(response) || {};
      for(var i = 0; i < data.quizzes.length; i++) {
        document.getElementById("welcome-quiz-" + i).innerHTML = data.quizzes[i].title;
      }
    }

    // Fail callback
    function dataFail(error) {
      handleError(error);
    }
  }

  function welcomeSelect(op) {

    try {

      // Set or reset variables
      qList = data.quizzes[op].questions;
      aList = [];
      for(var i = 0; i < qList.length; i++) {
        aList.push(0);
      }

      // Go to next page
      quizLoad();

    } catch (e) {
      handleError(e);
    }
  }

  function quizLoad() {

    try {

      // Validate
      if (!data) throw 'Error: data not found';

      // Fill page
      showPage('quiz');
      document.activeElement.blur();
      for (var i = 0; i < 4; i++) {
        document.getElementById("quiz-" + i).style.borderColor = '#C0C0C0';
        document.getElementById("quiz-" + i).style.backgroundColor = '#fff';
      }
      document.getElementById('quiz-score').innerHTML = 'Score: ' + calcScore();
      document.getElementById('quiz-question').innerHTML = ( qNum + 1 ) + ' - ' + qList[qNum].question;
      for(var i = 0; i < qList[qNum].answers.length; i++) {
        document.getElementById("quiz-" + i).innerHTML = qList[qNum].answers[i].content;
      }

    } catch (e) {
      handleError(e);
    }
  }

  function quizSelect(aNum) {

    try {

      // Validate
      if (aNum < 0 || aNum > 4) throw 'invalid answer';

      //Update answer and score
      aList[qNum] = aNum;

      // Change color according true/false
      document.getElementById("quiz-" + aNum).style.backgroundColor = '#eee';
      for (var i=0; i < 4; i++) {
        document.getElementById("quiz-" + i).style.borderColor = qList[qNum].answers[i].value ? '#008000' : '#FF0000';
      }

      // Go to next page
      qNum++;
      if (qNum < qList.length) {
        setTimeout(quizLoad, 2000);
      } else {
        setTimeout(completionLoad, 2000);
      }

    } catch (e) {
        handleError(e);
    }
  }

  function completionLoad() {

    // Show page
    showPage('completion');

    // Fill page
    var score = calcScore();
    var pass = score > (qList.length / 2);
    document.getElementById('completion-score').innerHTML = 'Score: ' + score;
    document.getElementById('completion-pass').innerHTML = pass ? 'Pass' : 'Fail' ;
    document.getElementById("completion-pass").style.color = pass ? 'green' : 'red';
  }


  function dataGet(url, dataSuccess, dataFail) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        if(xhr.status == 200) {
          dataSuccess(xhr.responseText);
        } else {
          dataFail(xhr.status);
        }
      }
    }
    xhr.send();
  }

  function showPage(pg) {
    document.getElementById("alert").style.display = ( pg  == 'alert' ) ? 'block' : 'none';
    document.getElementById("welcome").style.display = ( pg  == 'welcome' ) ? 'block' : 'none';
    document.getElementById("quiz").style.display = ( pg  == 'quiz' ) ? 'block' : 'none';
    document.getElementById("completion").style.display = ( pg  == 'completion' ) ? 'block' : 'none';
  }

  function handleError(err) {

    if (err == 404) err = 'failed to load data';
    console.error(err);
    document.getElementById("alert").innerHTML = 'Error!<br>Contact support';
    showPage('alert');
  }

  function calcScore() {

    score = 0;
    for(var i = 0; i < qList.length; i++) {
      if (qList[i].answers[aList[i]].value) score++;
    }
    return score;
  }
})();

window.onLoad = app.welcomeLoad();

