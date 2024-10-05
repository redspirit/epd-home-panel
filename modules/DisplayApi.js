const axios = require('axios');

class DisplayApi {
    constructor(baseURL) {
        this.client = axios.create({baseURL});
    }

    request (name, buf, params) {
        console.log(`Make request ${name}`);
        return this.client.post(name, buf, {
            headers: {
                'content-type': 'application/octet-stream'
            },
            params,
        }).then(r => r.data);
    }

    async drawGrayscale(grayPart1, grayPart2) {
        await this.request('/display/gray1', grayPart1);
        await this.request('/display/gray2', grayPart2);
    }

    async drawMonochrome(buffer) {
        await this.request('/display/mono', buffer);
    }

    async drawPartial(x, y, w, h, buffer) {
        await this.request('/display/part', buffer, {x, y, w, h});
    }

    async clear() {
        await this.request('/clear', {});
    }

}

module.exports = {
    DisplayApi
}
