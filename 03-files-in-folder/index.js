const path = require('path');
const fs = require('fs');

const readFiles = (dirname = path.join(__dirname, 'secret-folder')) => {
    fs.readdir(dirname, (err, filenames) => {
        filenames.forEach(filename => {
            const name = path.parse(filename).name;
            const ext = path.parse(filename).ext.replace('.', '');
            const filepath = path.resolve(dirname, filename);

            fs.stat(filepath, (error, stat) => {
                if (error) throw error;
                const isFile = stat.isFile();

                if (isFile) {
                    console.log(`${name} - ${ext} - ${stat.size}b`);
                } else {
                    readFiles(filepath)
                }
            });
        });
    });
}

readFiles();