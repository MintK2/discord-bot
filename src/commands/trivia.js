import triviaDB from 'triviadb'

export function triva(message, client) {
  //initialize triviadb and create object
  let TriviaQuestion = function() {
    return triviaDB.getQuestions(1, null, "easy").then(token => { return token } )
  }
  
  let triviaResult = TriviaQuestion()

  //gets trivia question, displays question, adds reaction for user to select answer
  return triviaResult.then(function(result) {
   let answerArray = result.results[0].incorrect_answers.push(result.results[0].correct_answer);

    //replace string entities with the correspoinding symbol
    var strQuestion = result.results[0].question
    var mapObj = {
        '&quot;': '"',
        '&#039;': "'",
    }
    strQuestion = strQuestion.replace(/&quot;|&#039;/gi, function(matched){
        return mapObj[matched];
    })

    message.channel.send(strQuestion).then(function (message) {
        message.react("🇦")
        message.react("🇧")
        message.react("🇨")
        message.react("🇩")
      }).catch(function() {
        console.log('err')
        });
    let correctAnswer = result.results[0].correct_answer
    answerArray = result.results[0].incorrect_answers.sort()
    
    //displays possible answers for user
    for(let x in answerArray) {
        let abcArray = ['A','B','C','D']
        message.channel.send(abcArray[x] + ': ' + answerArray[x])
    }

    let answerCount = 0
    const msgCorrect = "**CORRECT**";
    const msgIncorrect = "**INCORRECT**, the correct answer is: " + correctAnswer;

    //check for user reactions
    client.on('messageReactionAdd', (reaction) => {
    let emoji = reaction.emoji; 
    
    //logic for what answer the user selects
    if (answerCount === 0) {          
        switch (emoji.name) {                       
            case "🇦":           
                if (correctAnswer === answerArray[0] && emoji.reaction.count > 1){ 
                    answerCount++
                    return message.channel.send(msgCorrect)
                } else if (correctAnswer !== answerArray[0] && emoji.reaction.count > 1) {
                    answerCount++
                    return message.channel.send(msgIncorrect)
                }
                
                break
            case "🇧":
                if (correctAnswer === answerArray[1] && emoji.reaction.count > 1){
                        answerCount++
                        return message.channel.send(msgCorrect)
                    } else if (correctAnswer !== answerArray[1] && emoji.reaction.count > 1) { 
                        answerCount++                             
                        return message.channel.send(msgIncorrect)
                    }
                    break
            case "🇨":
                if (correctAnswer === answerArray[2] && emoji.reaction.count > 1){   
                    answerCount++                         
                    return message.channel.send(msgCorrect)
                } else if (correctAnswer !== answerArray[2] && emoji.reaction.count > 1) { 
                    answerCount++                            
                    return message.channel.send(msgIncorrect)
                }
                break
            case "🇩":
                if (correctAnswer === answerArray[3] && emoji.reaction.count > 1){
                    answerCount++
                    return message.channel.send(msgCorrect)
                } else if (correctAnswer !== answerArray[3] && emoji.reaction.count > 1) {  
                    answerCount++    
                    return message.channel.send(msgIncorrect)
                }
        }
    }
        
});              
  }) 
}
