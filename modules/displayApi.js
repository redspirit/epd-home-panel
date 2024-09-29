const axios = require('axios');

const client = axios.create({
    baseURL: `http://192.168.1.49:3000`
});

const makeRequest = async (name, buf) => {
    console.log(`Make request ${name}`);
    return client.post(name, buf, {
        headers: {
            'content-type': 'application/octet-stream'
        }
    }).then(r => r.data);
};

module.exports = {
    makeRequest
}
