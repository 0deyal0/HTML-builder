const fs = require("fs")
const path = require("path")

const mergeStyles = async (src = path.resolve(__dirname, 'styles'), destFilePath = path.resolve(__dirname, 'project-dist', 'bundle.css')) => {
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    try {
        await fs.promises.unlink(destFilePath);
    }
    catch {}

    if (entries.length === 0) {
        return;
    }

    let stream = fs.createWriteStream(destFilePath, { flags: 'a' });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        if (entry.isFile() && path.parse(entry.name).ext === '.css') {
            const data = await fs.promises.readFile(srcPath);
            stream.write(data);
        }
    }

    stream.close();
}

exports.mergeStyles = mergeStyles;
mergeStyles();
