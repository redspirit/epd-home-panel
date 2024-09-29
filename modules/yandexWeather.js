const axios = require('axios');
const token = process.env.YANDEXWIATHERTOKEN;
const lat = 59.824118;
const lng = 30.344210;

// use free api by yandex https://yandex.ru/pogoda/b2b/smarthome
const getWeather = () => {
    return axios.get('https://api.weather.yandex.ru/v2/forecast', {
        params: {lat, lng},
        headers: {
            'X-Yandex-Weather-Key': token
        }
    }).then(res => res.data);
}

module.exports = {
    getWeather
}
