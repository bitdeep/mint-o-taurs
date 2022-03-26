// testnet bsc
const mainAddress = '0x400b94B7BBbCE520950f4e3d6A3eEe2d649184e7';
let web3, account, main;

// hold both prices of a public and whitelisted mint
let PRICE;

function fromWei(v) {
    return web3.utils.fromWei(v);
}
function toWei(v) {
    return web3.utils.toWei(v);
}
let Web3Modal, web3Modal, provider;
async function onLoad(){
    const providerOptions = {};
    Web3Modal = window.Web3Modal.default;
    web3Modal = new Web3Modal({});
    provider = await web3Modal.connect();
    provider.on("accountsChanged", (accounts) => {
        console.log("accountsChanged", accounts);
        load(provider);
    });
    provider.on("chainChanged", (chainId) => {
        console.log("chainChanged", chainId);
        load(provider);
    });
    provider.on("connect", (info) => {
        console.log("connect", info);
        load(provider);
    });
    provider.on("disconnect", (error) => {
        console.log("disconnect", error);
        alert(error.message);
    });

    load(provider);
    // setInterval(pendingReward, 10000);
}

async function load(provider) {
    const enabled = await accountLoad(provider);
    if (enabled) {
        $('#WALLET').html(account);
        $('#CONTRACT').html(mainAddress);
        main = new web3.eth.Contract(abi_main, mainAddress);
        contractStats();
    } else {
        alert('no web3 connection');
    }
}

async function accountLoad(provider) {
    if (provider) {
        const r = await provider.request({method: 'eth_requestAccounts'});
        web3 = new Web3(provider);
        account = r[0];
        return true;
    }
    return false;
}


async function contractStats(){
    const SALE_ACTIVE = await main.methods.SALE_ACTIVE().call();
    $('#SALE_ACTIVE').css('display', SALE_ACTIVE?'':'none');

    const totalSupply = await main.methods.totalSupply().call();
    console.log(totalSupply)
    $('#totalSupply').html(totalSupply);

    PRICE = await main.methods.PRICE().call();
    const price = PRICE/1e18;
    $('#PUBLIC_SALE_PRICE').html(`${price} ONE`);

    loadLastMintedNft();
    loadAllMintedNft();

}

async function tokenURI(){
    const tokenURIInput = $('#tokenURIInput').val();
    const tokenURI = await main.methods.tokenURI(tokenURIInput).call();
    $('#tokenURI').html(tokenURI);
}

async function mintPublic(val){
    $('#mintInfo').html("Wait... preparing your Taurs...");
    const tx = await main.methods.mint(val).send({from: account, value: PRICE*val});
    $('#tx').html(tx.transactionHash);
    $('#mintInfo').html("");
    await loadLastMintedNft();
    await loadAllMintedNft();
}
async function loadLastMintedNft(){
    $('#MyMints').html("Loading...");
    let balanceOf = await main.methods.balanceOf(account).call();
    if( balanceOf == 0 ){
        let html = `<h1>You have no minted Taurs yet.</h1>`;
        $('#MyMints').html(html);
        return;
    }
    let html = `<h1>My mints (${balanceOf})</h1>`;
    for( let index = balanceOf-1 ; index >= 0; index -- ) {
        const tokenOfOwnerByIndex = await main.methods.tokenOfOwnerByIndex(account, index).call();
        const tokenURI = await main.methods.tokenURI(tokenOfOwnerByIndex).call();
        $.get(tokenURI, function (r) {
            const name = r.name;
            const image = r.image;
            html += `<div class="box">${name}<br/><img src="${image}" height="320" class="shadow-lg  mb-5 bg-body rounded" /></div>`;
            $('#MyMints').html(html);
        });
    }


}


async function loadAllMintedNft(){
    $('#AllMints').html("Wait...");
    let totalSupply = await main.methods.totalSupply().call();
    if( totalSupply == 0 ){
        $('#AllMints').html("No minted Taurs.");
        return;
    }
    let html = `<h1>All Minted ${totalSupply}</h1>`;
    for( let index = totalSupply-1 ; index >= 0; index -- ) {
        const tokenURI = await main.methods.tokenURI(index).call();
        $.get(tokenURI, async function (r) {
            const name = r.name;
            const image = r.image;
            const ownerOf = await main.methods.ownerOf(index).call();
            const walletId = ownerOf.substr(ownerOf.length - 5);
            html += `<div class="box">${name} - ...${walletId}<br/><img src="${image}" height="320" class="shadow-lg  mb-5 bg-body rounded" /></div>`;
            $('#AllMints').html(html);
        });
    }


}
