const pug = require('pug');

class Dashboard {
    constructor(file) {
        this.templateFile = file || './templates/main.pug';
        this.refreshTemplate();
    }

    refreshTemplate() {
        this.template = pug.compileFile(this.templateFile);
    }
    getPage(data) {
        return this.template(data);
    }
}

module.exports = {
    Dashboard
}
