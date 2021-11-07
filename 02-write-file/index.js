const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

process.on('exit', (code) => {
    console.log('bye');
});

const readlineInterface = readline.createInterface({ input, output });

const ask = (questionText) => {
    return new Promise((resolve, reject) => {
        readlineInterface.question(questionText, (input) => resolve(input));
    });
}

const writeFile = async () => {
    let stream = fs.createWriteStream(path.join(__dirname, 'text.txt'), { flags: 'a' });
    while (true) {
        const text = await ask('Input text: ');
        if (text.includes('exit')) { break; }
        stream.write(text);
    }

    stream.close();
    process.exit();
}

writeFile();