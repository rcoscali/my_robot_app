document.getElementById('kraken_key').value = krakenKey
document.getElementById('kraken_key_secret').value = krakenSecret
document.getElementById('binance_key').value = binanceKey
document.getElementById('binance_key_secret').value = binanceSecret
document.getElementById('ftx_key').value = ftxKey
document.getElementById('ftx_key_secret').value = ftxSecret
document.getElementById('ftx_subaccount').value = ftxSubAccount
if (document.getElementById('kraken_key').value != '' &&
    document.getElementById('kraken_key_secret').value != '' &&
    document.getElementById('binance_key').value != '' &&
    document.getElementById('binance_key_secret').value != '' &&
    document.getElementById('ftx_key').value != '' &&
    document.getElementById('ftx_key_secret').value != '')
{
    document.getElementById('run_button').hidden = false;
}
else
{
    document.getElementById('run_button').hidden = true;
}
    
