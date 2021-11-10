
const { promises: fs } = require("fs")
const path = require("path")

const copyDir = async (src = path.resolve(__dirname, 'files'), dest = path.resolve(__dirname, 'files-copy')) => {
    try {
        await fs.rm(dest, { recursive: true });
    } catch { }

    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ?
            await copyDir(srcPath, destPath) :
            await fs.copyFile(srcPath, destPath);
    }
}

exports.copyDir = copyDir;
copyDir();