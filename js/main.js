
function changeCity() {
    const city = $('#citySelected').val();
    if (city) {
        const cityJson = JSON.parse(city);
        if (cityJson?.lat && cityJson?.lon) {
            getForcastData(cityJson.lat, cityJson.lon);
        }
    }
}

function getForcastData(lat, lon) {
    $.get(`http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&unit=metric&product=civil&output=json`).then((response) => {
        const data = JSON.parse(response);
        bindData(data?.dataseries);
    }, (error) => {
        console.error(error);
    });
}

function bindData(data) {
    $('#content-data').empty();
    for (let index = 0; index < data.length; index++) {
        const element = data[index];

        if (element) {
            const cloudCover = cloudCoverData[element.cloudcover];
            const precipitation = precipitationData[element.prec_amount];
            const humadity = humadityData(element.rh2m);
            const content = `<div class="col">
                                <div class="card mb-4 rounded-3 shadow-sm">
                                    <img src="/images/${getImage(cloudCover, precipitation, humadity)}.png" alt="${element.weather}">
                                    <div class="card-body">
                                        <h5 class="card-title capitalize-me">${weatherTypeData[element.weather]}</h5>
                                        <p>Wind  <b>Direction: ${element.wind10m.direction}, Speed:  ${windSpeed[element.wind10m.speed]} </b></p>
                                        ${element.temp2m ? temperatureText(element) : ''} 
                                        ${element.prec_amount ? precipitationText(element) : ''}                 
                                    </div>
                                </div>
                            </div>`;

            $('#content-data').append(content);
        }

    }
}

function precipitationText(element) {
    return `<p>Precipitation:  <b>${element.prec_type}, ${element.prec_amount}</b></p>`;
}

function temperatureText(element) {
    return `<p>Temperature <b>${element.temp2m}</b></p>`;
}

function humadityData(hu) {
    return hu.replace('%', '');
}

function getImage(cloudCover, precipitation, humidity) {

    let img = 'humid';

    if (humidity > 90 && cloudCover.max < 60) {
        img = 'fog';
    } else if (precipitation.min > 10.8) {
        img = 'windy';
    } else if (precipitation.min > 4) {
        img = 'rain';
    } else if (precipitation.min < 4) {
        if (cloudCover.min > 80) {
            img = 'lightrain';
        } else if (cloudCover.min >= 60 && cloudCover.max > 80) {
            img = 'oshower';
        } else if (cloudCover.min < 60) {
            img = 'ishower';
        } else {
            img = 'lightsnow';
        }
    } else {
        if (cloudCover.min < 20) {
            img = 'clear';
        } else if (cloudCover.min >= 20 && cloudCover.max < 60) {
            img = 'pcloudy';
        } else if (cloudCover.min >= 60 && cloudCover.max < 80) {
            img = 'mcloudy';
        } else if (cloudCover.max > 80) {
            img = 'cloudy';
        }
    }

    return img;
}

const windSpeed = {
    1: 'Below 0.3m/s (calm)',
    2: '0.3-3.4m/s (light)',
    3: '3.4-8.0m/s (moderate)',
    4: '8.0-10.8m/s (fresh)',
    5: '10.8-17.2m/s (strong)',
    6: '17.2-24.5m/s (gale)',
    7: '24.5-32.6m/s (storm)',
    8: 'Over 32.6m/s (hurricane)'
}

const cloudCoverData = {
    1: { min: 0, max: 6 },
    2: { min: 6, max: 19 },
    3: { min: 19, max: 31 },
    4: { min: 31, max: 44 },
    5: { min: 44, max: 56 },
    6: { min: 56, max: 69 },
    7: { min: 69, max: 81 },
    8: { min: 81, max: 94 },
    9: { min: 94, max: 100 },
}

const precipitationData = {
    0: { min: 0, max: 0 },
    1: { min: 0, max: 0.25 },
    2: { min: 0.25, max: 1 },
    3: { min: 1, max: 4 },
    4: { min: 4, max: 10 },
    5: { min: 10, max: 16 },
    6: { min: 16, max: 30 },
    7: { min: 30, max: 50 },
    8: { min: 50, max: 75 },
    9: { min: 75, max: 75 },
}

const weatherTypeData = {
    'clearday': 'Clear Day',
    'clearnight': 'clear night',
    'pcloudyday': 'pcloudy day',
    'mcloudyday': 'mcloudy day',
    'mcloudynight': 'mcloudy night',
    'cloudyday': 'cloudy day',
    'cloudynight': 'cloudy night',
    'humidday': 'humid day',
    'humidnight': 'humid night',
    'lightrainday': 'light rain day',
    'lightrainnight': 'light rain night',
    'oshowerday': 'o shower day',
    'oshowernight': 'o shower night',
    'ishowerday': 'i shower day',
    'ishowernight': 'i shower night',
    'lightsnowday': 'light snow day',
    'rainday': 'rain day',
    'rainnight': 'rain night',
    'snowday': 'snow day',
    'snownight': 'snow night',
    'rainsnownight': 'rain snow night',
    'rainsnowday': 'rain snow day',
    'pcloudynight': 'p cloudy night'
}