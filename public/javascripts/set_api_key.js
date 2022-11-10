function getExchange()
{
    const queryString = document.location.search;
    const urlParams = new URLSearchParams(queryString);
    var exchange = urlParams.get('exchange');
    if (exchange == undefined)
	exchange = document.getElementById('exchange').value;
    return exchange;
}

function getKey()
{
    const queryString = document.location.search;
    const urlParams = new URLSearchParams(queryString);
    return(urlParams.get('Key'));
}

function getKeySecret()
{
    const queryString = document.location.search;
    const urlParams = new URLSearchParams(queryString);
    return(urlParams.get('Secret'));
}

function getSubAccount()
{
    const queryString = document.location.search;
    const urlParams = new URLSearchParams(queryString);
    return(urlParams.get('SubAccount'));
}


