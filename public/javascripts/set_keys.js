document.getElementById('kraken_key').value = krakenKey
document.getElementById('kraken_key_secret').value = krakenSecret
document.getElementById('binance_key').value = binanceKey
document.getElementById('binance_key_secret').value = binanceSecret
document.getElementById('ftx_key').value = ftxKey
document.getElementById('ftx_key_secret').value = ftxSecret
document.getElementById('ftx_subaccount').value = ftxSubAccount
document.getElementById('out_exchange').selected = outExchange
document.getElementById('outkey').value = outKey
document.getElementById('outkey_secret').value = outKeySecret
document.getElementById('out_exchange_subaccount').value = outExchangeSubAccount
if (document.getElementById('kraken_key').value != '' &&
    document.getElementById('kraken_key_secret').value != '' &&
    document.getElementById('binance_key').value != '' &&
    document.getElementById('binance_key_secret').value != '' &&
    document.getElementById('ftx_key').value != '' &&
    document.getElementById('ftx_key_secret').value != ''
    document.getElementById('out_exchange').selected != '' &&
    document.getElementById('outkey').value != '' &&
    document.getElementById('outkey_secret').value != ''
    document.getElementById('out_exchange_subaccount').value != ''
   )
{
    document.getElementById('run_button').hidden = false;
}
else
{
    document.getElementById('run_button').hidden = true;
}
    
