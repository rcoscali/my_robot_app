function initValues()
{
    document.getElementById('key').value = getKey();
    document.getElementById('key_secret').value = getKeySecret();
    document.getElementById('subaccount').value = getSubAccount();
}

function doDelete()
{
    document.getElementById('exchange').value=getExchange();
    document.location.href='https://localhost/delete_from_db?exchange='+getExchange()+'&key='+getKey();     
}

initValues();    

