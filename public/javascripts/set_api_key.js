function getExchange()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var exchange = urlParams.get('exchange');
    return exchange;
}

function getKey()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return(urlParams.get('Key'));
}

function getKeySecret()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return(urlParams.get('Secret'));
}

function getSubAccount()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return(urlParams.get('SubAccount'));
}


