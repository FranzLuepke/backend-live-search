const axios = require('axios');
var parseString = require('xml2js').parseString;

let xmls= `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="https://www.w3schools.com/xml/">
<soapenv:Header/>
<soapenv:Body>
<ns:CelsiusToFahrenheit>
<!--Optional:-->
<ns:Celsius>100</ns:Celsius>
</ns:CelsiusToFahrenheit>
</soapenv:Body>
</soapenv:Envelope>`;

axios.post('https://www.w3schools.com/xml/tempconvert.asmx',xmls,{headers:{'Content-Type': 'text/xml'}}).then(res=> {
    parseString(res.data, function (err, result) {
        const envelope = result['soap:Envelope'];
        const body = envelope['soap:Body'][0];
        const response = body['CelsiusToFahrenheitResponse'][0];
        const conversionResult = response['CelsiusToFahrenheitResult'][0];
        console.dir(conversionResult);
    });
}).catch((err) => {
    console.log(err)
});