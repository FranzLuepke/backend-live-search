const axios = require('axios');
var parseString = require('xml2js').parseString;

let xmls= `
<soapenv:Envelope
    xmlns:xsd=http://services.rccl.com/consumermanagement/cem/xsd
    xmlns:con=http://services.rccl.com/interfaces/ConsumerSearchService
    xmlns:xsd1=http://services.rccl.com/xsd
    xmlns:soapenv=http://schemas.xmlsoap.org/soap/envelope
/>
    <soapenv:Header/>
    <soapenv:Body>
    <con:getConsumerLoyaltyPrograms>
        <xsd:RCL_SearchTransactionRQ>
            <xsd:ID>49421151</xsd:ID>
            <xsd:SearchType>LoyaltyMemberProgram</xsd:SearchType>
        </xsd:RCL_SearchTransactionRQ>
    </con:getConsumerLoyaltyPrograms>
    </soapenv:Body>
</soapenv:Envelope>`;

axios.post('https://cul.stg1.internal.services.rccl.com/consumersearch',xmls,{headers:{'Content-Type': 'text/xml'}}).then(res=> {
    console.log(res.data);
    // parseString(res.data, function (err, result) {
    //     console.dir(result);
    // });
}).catch((err) => {
    console.log(err)
});