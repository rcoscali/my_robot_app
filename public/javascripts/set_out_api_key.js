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
    var key = urlParams.get('Key');
    if (key == undefined)
        key = document.getElementById('key').value;
    return(key);
}

function getKeySecret()
{
    const queryString = document.location.search;
    const urlParams = new URLSearchParams(queryString);
    var secret = urlParams.get('Secret');
    if (secret == undefined)
        secret = document.getElementById('secret').value;
    return(secret);
}

function getSubAccount()
{
    const queryString = document.location.search;
    const urlParams = new URLSearchParams(queryString);
    var subaccount = urlParams.get('subaccount');
    if (subaccount == undefined)
        subaccount = document.getElementById('subaccount').value;
    return(subaccount);
}


