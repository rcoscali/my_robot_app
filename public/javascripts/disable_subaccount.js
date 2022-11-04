var exchange = getExchange();
if (exchange != 'ftx')
{
    document.getElementById('subaccount_div').hidden = true;
    document.getElementById('subaccount').hidden = true;
}
else
{
    document.getElementById('subaccount_div').hidden = false;
    document.getElementById('subaccount').hidden = false;
}
