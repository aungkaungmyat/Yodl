let model = require('./quickstart.js');

qString = "someone you loved"

model(qString, (error, result) => {
    if(error) {
        console.log(error)
    } else {
        console.log(result)
    }
})