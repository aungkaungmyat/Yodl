let model = require('./quickstart.js');

model((error, result) => {
    if(error) {
        console.log(error)
    } else {
        console.log(result)
    }
})