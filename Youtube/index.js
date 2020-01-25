let model = require('./quickstart.js');

qString = ""

model(qString, (error, result) => {
    if(error) {
        console.log(error)
    } else {
        console.log(result)
    }
})