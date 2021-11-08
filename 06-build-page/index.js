const fs = require("fs");
const path = require("path");

const copyDir = async (src = path.resolve(__dirname, 'files'), dest = path.resolve(__dirname, 'files-copy')) => {
    await fs.promises.mkdir(dest, { recursive: true });
    let entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ?
            await copyDir(srcPath, destPath) :
            await fs.promises.copyFile(srcPath, destPath);
    }
}

const mergeStyles = async (src = path.resolve(__dirname, 'styles'), destFilePath = path.resolve(__dirname, 'project-dist', 'bundle.css')) => {
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    try {
        await fs.promises.unlink(destFilePath);
    }
    catch { }

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

const buildPage = async (dir = __dirname) => {
    const template = path.resolve(dir, 'template.html');
    const componentsDir = path.resolve(dir, 'components');
    const dest = path.resolve(dir, 'project-dist');
    let templateData = (await fs.promises.readFile(template))?.toString();

    const componentNames = templateData.toString().match(/{{.*}}/g).map(str => str.replace(/[{|}]/g, ''));
    let componentsDict = {};
    for (const componentName of componentNames) {
        componentsDict[componentName] = (await fs.promises.readFile(path.resolve(componentsDir, `${componentName}.html`))).toString();
    }

    componentNames.forEach(componentName => {
        templateData = templateData.replace(new RegExp(`{{${componentName}}}`, 'g'), componentsDict[componentName]);
    });
    await fs.promises.rmdir(dest, { recursive: true });
    await fs.promises.mkdir(dest, { recursive: true });
    copyDir(path.resolve(dir, 'assets'), path.resolve(dest, 'assets'));
    mergeStyles(path.resolve(dir, 'styles'), path.resolve(dest, 'style.css'));
    await fs.promises.writeFile(path.resolve(dest, 'index.html'), templateData);

}

buildPage();
