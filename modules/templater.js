const pug = require('pug');

const templatePath = './templates/main.pug';
const template = pug.compileFile(templatePath);

const getPageHtml = (params = {}) => {
    params.pageTitle = 'Пример сайта';
    params.youAreUsingPug = true;
    return template(params);
}

module.exports = {
    getPageHtml
}
