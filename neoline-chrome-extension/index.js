window.addEventListener('NEOLine.N3.EVENT.READY', async () => {
    const NEO = '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5';
    const GAS = '0xd2a4cff31913016155e38e474a2c06d08be276cf';
    const bNEO = '0x5e815f1d964de2506c2f1b5918d69a3ecb44d66c';
    document.getElementById('install-neoline-chrome-extension').style.display = 'none';
    const dapi = new NEOLineN3.Init();
    const { address } = await dapi.getAccount();
    document.getElementById('connected-address').innerText = address;
    dapi.invokeRead({ scriptHash: NEO, operation: 'balanceOf', args: [{ type: 'Address', value: address }], signers: [] }).then(v => document.getElementById('neo-balance').innerText = v.stack[0].value);
    dapi.invokeRead({ scriptHash: GAS, operation: 'balanceOf', args: [{ type: 'Address', value: address }], signers: [] }).then(v => document.getElementById('gas-balance').innerText = v.stack[0].value / 100000000);
    dapi.invokeRead({ scriptHash: bNEO, operation: 'balanceOf', args: [{ type: 'Address', value: address }], signers: [] }).then(v => document.getElementById('neo-deposited').innerText = v.stack[0].value / 100000000);
    dapi.invokeRead({ scriptHash: bNEO, operation: 'reward', args: [{ type: 'Address', value: address }], signers: [] }).then(v => document.getElementById('gas-unclaimed').innerText = v.stack[0].value / 100000000);

    const notice = v => alert(`TX ${v.txid} SENT\nVIEW THE TX ON EXPLORERS\nREFRESH THIS PAGE IF NEEDED\n`)

    document.getElementById('action-deposit').onclick = () => {
        const val = document.getElementById('amount-deposit').value;
        const amt = val.length > 0 ? val : document.getElementById('neo-balance').innerText;
        dapi.send({ fromAddress: address, toAddress: bNEO, asset: NEO, amount: parseInt(amt) }).then(notice);
    }
    document.getElementById('action-withdraw').onclick = () => {
        const val = document.getElementById('amount-withdraw').value;
        const amt = val.length > 0 ? val : document.getElementById('neo-deposited').innerText;
        dapi.send({ fromAddress: address, toAddress: bNEO, asset: GAS, amount: parseInt(amt) / 100 }).then(notice);
    }
    document.getElementById('action-claim').onclick = () => {
        dapi.send({ fromAddress: address, toAddress: bNEO, asset: bNEO, amount: 0 }).then(notice);
    }
});
