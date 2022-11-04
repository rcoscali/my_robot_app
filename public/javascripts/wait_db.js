function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function do_wait()
{
    console.log('Waiting DB to update...');
    await sleep(1000);
    console.log('Done');
    //document.location.reload(true);
}
