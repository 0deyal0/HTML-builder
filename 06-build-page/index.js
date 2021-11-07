const fs = require("fs");
const readline = require('readline');
const path = require("path");
const { copyDir } = require("../04-copy-directory");
const {mergeStyles} = require("../05-merge-styles");

async function buildPage(dir = __dirname) {
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

    await fs.promises.writeFile(path.join(dest, 'index.html'), templateData);
    copyDir(path.resolve(dir, 'assets'), path.resolve(dest, 'assets'));
    mergeStyles(path.resolve(dir, 'styles'), path.resolve(dest, 'style.css'));
}

buildPage();
