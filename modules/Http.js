const axios = require('axios');

const url = 'http://192.168.1.49:3000/display';

const makeRequest = async (buf) => {
    return axios.post(url, buf, {
        headers: {
            'content-type': 'application/octet-stream'
        }
    }).then(r => r.data);
};

module.exports = {
    makeRequest
}
