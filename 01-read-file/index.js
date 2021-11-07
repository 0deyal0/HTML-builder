const path = require('path');
const fs = require('fs');

const readTxt = async () => {
    let stream
    try {
        stream = fs.createReadStream(path.join(__dirname, 'text.txt'));
        stream.on('data', data => {
            console.log(data.toString());
        });
    } finally {
    }
}

readTxt();