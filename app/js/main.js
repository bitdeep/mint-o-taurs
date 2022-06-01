const mainAddress = '0x054f9d0e096e40e0ef78dde23b1e3e2e0a24b62d'; // MAINNET
// const mainAddress = '0x569d13b7959cbb399260e67b80bb068fb4b8f651'; // TESTNET

let Web3Modal, web3Modal, provider;
let web3, account, main;
let PRICE;
let isConnected = false
let mintArray = []
let myMintArray = []

let initialized = false
let currentPage = 0
let LASTMINTED = 0

let FILTERCOMMON = false
let FILTERBRONZE = false
let FILTERSILVER = false
let FILTERGOLD = false

let posBody, aux, pixelDensity, pixelsWidth, sliderMin, sliderMax, isMobile;
let myTaursTotal = 0;
let myTaursCurrent = 0;
let count_common = 0;
let count_bronze = 0;
let count_silver = 0;
let count_gold = 0;
let count_diamond = 0;
let skins = [], horns = [], collars = [], shirts = [], backs = [], hairs = [], eyes = [], snouts = [], earrings = [], tatoos = [], id = [];

let taurCheckArray = []
let myTaurCheckArray = []

function fromWei(v) {
    return web3.utils.fromWei(v);
}
function toWei(v) {
    return web3.utils.toWei(v);
}

function checkCon(){
    return isConnected
}

function clearDivs(){
	$('#taurscontainer').empty();
}


function getAccount(){
	return account
}


function web3Disconnected(info){
    console.log("disconnect", info);
    isConnected = false    
    $('#nowallet1').enabled();    
    $('#nowallet').text('Connect Wallet');
    
}

function web3connected(info){
    console.log("connect", info);
    isConnected = true
    $('#nowallet1').hide();    
    $('#nowallet').text(account.substring(0,5)+ '...' + account.substring(account.length -5 ,account.length));
}

async function onLoad(page){

	currentPage = page

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
        web3connected(info)        
        load(provider);
    });
    provider.on("disconnect", (error) => {
        web3Disconnected(error)                
    });

    load(provider);
}

async function load(provider) {
    const enabled = await accountLoad(provider);	

    if (enabled) {

        web3connected({})

        $('#WALLET').html(account);
        $('#CONTRACT').html(mainAddress);
        $('#link_contract').prop("href", "https://explorer.harmony.one/address/"+mainAddress+"")

		console.log('Connecting on ', mainAddress)
                
        main = new web3.eth.Contract(abi_main, mainAddress);

        contractStats();        
        loadStuff();

    } else {
        web3Disconnected({})
        alert('no web3 connection');
    }
}


function loadStuff(){

    isMobile = 2; // 0 = desktop, 1 = mobile, 2 = no definido
	calcPixelDensity();
	resizeCheck();
	checkArrows();
	
	window.onresize = function(event) {
		calcPixelDensity();
		resizeCheck();
	};

}

async function accountLoad(provider) {
    if (provider) {
        const r = await provider.request({method: 'eth_requestAccounts'});
        web3 = new Web3(provider);
        account = r[0];

        console.log('Account loaded ', account)
        return true;
    }
    return false;
}


async function contractStats(){

    try{

        const SALE_ACTIVE = await main.methods.SALE_ACTIVE().call();
        $('#SALE_ACTIVE').css('display', SALE_ACTIVE?'':'none');

        const totalSupply = await main.methods.totalSupply().call();
        $('#totalSupply').html(totalSupply);

        PRICE = await main.methods.PRICE().call();
        const price = PRICE/1e18;

        $('#PUBLIC_SALE_PRICE').html(`${price} ONE`);		

		$('#filtros').hide();    
		initialized = false

		if(currentPage === 0)
			await loadAllMintedNft();
		
		else if(currentPage === 1)
        	await loadLastMintedNft();

		else if(currentPage === 2){
			await loadAllMintedNft();
			await loadLastMintedNft();
		}
        	
		
		$('#filtros').show();    
        initialized = true
        
    }
    catch(e){ 


        console.log(e)
    }

    

}


async function tokenURI(){
    const tokenURIInput = $('#tokenURIInput').val();
    const tokenURI = await main.methods.tokenURI(tokenURIInput).call();
    $('#tokenURI').html(tokenURI);
}


async function mint_(total){
    await mintPublic(total)
}


async function mintPublic(val){
    
    await main.methods.mint(val).send({from: account, value: PRICE*val});     
	document.location.href = "viewall.html";
    await loadLastMintedNft();    
}


async function loadLastMintedNft(){

	$('#myTaurs').text('Please wait....');

    let balanceOf = await main.methods.balanceOf(account).call();

    myMintArray = []
	myTaurCheckArray = []

	let LOGOCOMMON1 = 0
    let LOGOBRONZE1 = 0
    let LOGOSILVER1 = 0
    let LOGOGOLD1 = 0		

	if(balanceOf > 0){

		$('#total_minted1').text('Total minted: '+ String(balanceOf) + ' / 5050');
    	$('#notaursyet1').hide();  
				
		for( let index = balanceOf-1 ; index >= 0; index -- ) {

			const tokenOfOwnerByIndex = await main.methods.tokenOfOwnerByIndex(account, index).call();
			const tokenURI = await main.methods.tokenURI(tokenOfOwnerByIndex).call();
	
			$.get(tokenURI, function (r) {

				console.log('Checking ', index)
				console.log(r)

				if(! myTaurCheckArray.includes(index)){

					myTaurCheckArray.push(r.index)
					myMintArray.push(r)
		
					if(r.image){

						r.index = index            

						const taurID = r.name.replace("Taurs #", "")

						console.log(taurID)

						
						const taurImg = r.image
						const taurName = r.name
						const taurRarity = getProperties("LOGO", r)    
						const taurSkin = getProperties("SKIN", r)
						const taurHorns = getProperties("HORNS", r)
						const taurCollar = getProperties("COLLAR", r)
						const taurShirt = getProperties("SHIRTS", r)
						const taurBack = getProperties("BACKGROUND", r)
						const taurHair = getProperties("HEAD", r)
						const taurEyes = getProperties("EYES", r)
						const taurSnout = getProperties("SNOUT", r)
						const taurEarrings = getProperties("EARS", r)
						const taurTatoos = getProperties("TATOOS", r)   					
						
						if(taurRarity === "Bronze")
							LOGOBRONZE1++                    											

						else if(taurRarity === "Silver")
							LOGOSILVER1++
																	
						else if(taurRarity === "Gold")
							LOGOGOLD1++                    
											
						else 
							LOGOCOMMON1++			
		
						
						myTaursAddTaur(taurRarity, taurName, taurImg , taurSkin , taurHorns , taurCollar , taurShirt , taurBack , taurHair , taurEyes , taurSnout , taurEarrings , taurTatoos , taurID)
						

						$('#logo_common1').text(''+String(LOGOCOMMON1));
						$('#logo_bronze1').text(''+String(LOGOBRONZE1));
						$('#logo_silver1').text(''+String(LOGOSILVER1));
						$('#logo_gold1').text(''+String(LOGOGOLD1)); 
		
						
					} 

				}
	
				                       
	
			});
	
			
		}

		
		$('#myTaurs').text('My Taurs');

	}

	else {

		$('#myTaurs').text('My Taurs');
		$('#total_minted1').text('Total minted: 0 / 5050');
    	$('#notaursyet1').show();  

	}

    
        
}


async function loadAllMintedNft(){
   
	
    let totalSupply = await main.methods.totalSupply().call();

    mintArray = []	
	taurCheckArray = []		
	 
    let LOGOCOMMON = 0
    let LOGOBRONZE = 0
    let LOGOSILVER = 0
    let LOGOGOLD = 0        
    
    if(totalSupply > 0){

		$('#total_minted').text('Total minted: '+ String(totalSupply) + ' / 5050');    	
		$('#notaursyet').hide() 

		for( let index = totalSupply-1 ; index >= 0; index -- ) {			
			
			const tokenURI = await main.methods.tokenURI(index).call();
			$.get(tokenURI, async function (r) {

				if(! taurCheckArray.includes(index)){
					
					taurCheckArray.push(index)

					r.index = index
					mintArray.push(r)
		
					InsertTaur(r)     
					
					if(r && r.attributes && Array.isArray(r.attributes)){
		
						r.attributes.forEach(element1 => {
			
							const trait = element1.trait_type
							const traitv = element1.value
			
							if(trait === "LOGO"){                    
			
								if(traitv === "Bronze")
									LOGOBRONZE++                    
			
								else if(traitv === "Silver")
									LOGOSILVER++
								
								else if(traitv === "Gold")
									LOGOGOLD++                    
			
								else 
									LOGOCOMMON++
								
							}
							
						});
			
					}
		
					$('#logo_common').text(''+String(LOGOCOMMON)+' / 3030');
					$('#logo_bronze').text(''+String(LOGOBRONZE)+' / 1515');
					$('#logo_silver').text(''+String(LOGOSILVER)+' / 353');
					$('#logo_gold').text(''+String(LOGOGOLD)+' / 152');   

				}
				
				 
	
			});
		}

	}
	else {

		$('#total_minted').text('Total minted: 0 / 5050');
    	$('#notaursyet').show();    

	}
        
    
    
    
}

function InsertTaur(r) {    

	const taurID = r.index

	const taurName = r.name
	const taurImg = r.image
	const taurRarity = getProperties("LOGO", r)    
	const taurSkin = getProperties("SKIN", r)
	const taurHorns = getProperties("HORNS", r)
	const taurCollar = getProperties("COLLAR", r)
	const taurShirt = getProperties("SHIRTS", r)
	const taurBack = getProperties("BACKGROUND", r)
	const taurHair = getProperties("HEAD", r)
	const taurEyes = getProperties("EYES", r)
	const taurSnout = getProperties("SNOUT", r)
	const taurEarrings = getProperties("EARS", r)
	const taurTatoos = getProperties("TATOOS", r)    
				
	
	var moduletxt = '<div class="result_module" style="background-image: url(\'';
	moduletxt += r.image;
	moduletxt += '\')"  onclick="PopUpOpen(\'' + taurRarity + '\',\'' + taurName + '\',\'' + taurImg + '\',\'' + taurSkin + '\',\'' + taurHorns + '\',\'' + taurCollar + '\',\'' + taurShirt + '\',\'' + taurBack + '\',\'' + taurHair + '\',\'' + taurEyes + '\',\'' + taurSnout + '\',\'' + taurEarrings + '\',\'' + taurTatoos + '\',\'' + taurID + '\')">#';
	moduletxt += r.index;
	moduletxt += ' <span class="viewdetails" onclick="PopUpOpen(\'' + taurRarity + '\',\'' + taurName + '\',\'' + taurImg + '\',\'' + taurSkin + '\',\'' + taurHorns + '\',\'' + taurCollar + '\',\'' + taurShirt + '\',\'' + taurBack + '\',\'' + taurHair + '\',\'' + taurEyes + '\',\'' + taurSnout + '\',\'' + taurEarrings + '\',\'' + taurTatoos + '\',\'' + taurID + '\')"">view details</span>';
	moduletxt += '</div> ';
	$('#taurscontainer').prepend(moduletxt);	
    
}


function getProperties(name, element){    

    let attr = "Empty"

    if(element && element.attributes && Array.isArray(element.attributes)){

        element.attributes.forEach(element1 => {

            const trait = element1.trait_type
            const traitv = element1.value

            if(trait.toUpperCase() === name.toUpperCase())
                attr = traitv                            
        });

    }


    return attr
}


function PopUpOpen(taurRarity, taurName, taurImg, taurSkin, taurHorns, taurCollar, taurShirt, taurBack, taurHair, taurEyes, taurSnout, taurEarrings, taurTatoos, taurID) {

    console.log(taurRarity, taurName, taurImg, taurSkin, taurHorns, taurCollar, taurShirt, taurBack, taurHair, taurEyes, taurSnout, taurEarrings, taurTatoos, taurID)

	var moduletxt = '<div class="result_popup" id="result_popup" onclick="PopUpClose()">';
	moduletxt += '<div class="result_popup_container">';
	moduletxt += '<div class="result_popup_close" onclick="PopUpClose()">X</div>';
	moduletxt += '<div class="result_thumb" style="background-image: url(\'' + taurImg + '\')"></div>';
	moduletxt += '<div class="result_info">';
	moduletxt += '<h2 class="link_color">#' + taurID + '</h2>';
	moduletxt += '<h4>Rarity: <span class="link_color">' + taurRarity + '</span></h4>';
	moduletxt += '<div class="resultinfotraits">Skin: <span class="link_color" name="skin">' + taurSkin + '</span></div>';
	moduletxt += '<div class="resultinfotraits">Horns: <span class="link_color" name="horns">' + taurHorns + '</span></div>';
	moduletxt += '<div class="resultinfotraits">Collar: <span class="link_color" name="collar">' + taurCollar + '</span></div>';
	moduletxt += '<div class="resultinfotraits">Shirt: <span class="link_color" name="shirt">' + taurShirt + '</span></div>';
	moduletxt += '<div class="resultinfotraits">Background: <span class="link_color" name="background">' + taurBack + '</span></div>';
	moduletxt += '<div class="resultinfotraits">Hair: <span class="link_color" name="hair">' + taurHair + '</span></div>';
	moduletxt += '<div class="resultinfotraits">Eyes: <span class="link_color" name="eyes">' + taurEyes + '</span></div>';
	moduletxt += '<div class="resultinfotraits">Snout: <span class="link_color" name="snout">' + taurSnout + '</span></div>';
	moduletxt += '<div class="resultinfotraits">Earring: <span class="link_color" name="earring">' + taurEarrings + '</span></div>';
	moduletxt += '<div class="resultinfotraits">Tatoo: <span class="link_color" name="tatoo">' + taurTatoos + '</span></div>';
	moduletxt += '</div></div></div>';
	$('#container').append(moduletxt);
}

function PopUpClose() {
	$('#result_popup').remove();
}


function filter(value){
    
	if(initialized){

		if(value === 1) FILTERCOMMON = !FILTERCOMMON
		if(value === 2) FILTERBRONZE = !FILTERBRONZE
		if(value === 3) FILTERSILVER = !FILTERSILVER
		if(value === 4) FILTERGOLD   = !FILTERGOLD

		search()

	}
    
}


function search(){
	

	clearDivs()

	if(!FILTERCOMMON && !FILTERBRONZE && !FILTERSILVER && !FILTERGOLD)
		refresh()
	
	else if(FILTERCOMMON && FILTERBRONZE && FILTERSILVER && FILTERGOLD)
		refresh()	
	else 
		searchContinue()
    
        
}

function searchContinue(){

    // const searchtext = $('#palabrasclave').val().toUpperCase();

	taurCheckArray = []
    
    mintArray.forEach(element => {

		if(! taurCheckArray.includes(element.index)){
					
			taurCheckArray.push(element.index)

			if(element && element.attributes && Array.isArray(element.attributes)){

				element.attributes.forEach(element1 => {
	
					const trait = element1.trait_type
					const traitv = element1.value                
					
					if(trait === "LOGO"){   
											
						if(FILTERBRONZE && traitv === "Bronze")
							InsertTaur(element)
										
						else if(FILTERSILVER && traitv === "Silver")
							InsertTaur(element)
						
						else if(FILTERGOLD && traitv === "Gold")
							InsertTaur(element)
	
						else if(FILTERCOMMON && traitv === "Common")
							InsertTaur(element)
	
					}
					
				});
	
			}

		}
        
        
                    
    });
    
}


function refresh(){

    // const searchtext = $('#palabrasclave').val().toUpperCase();
    
	taurCheckArray = []

    mintArray.forEach(element => {        

		if(! taurCheckArray.includes(element.index)){
					
			taurCheckArray.push(element.index)
			InsertTaur(element)

		}
        
    });
    
}


function resizeCheck() {
	if (window.innerWidth > 640) {
		// Desktop
		if (isMobile != 0) {
			isMobile = 0;
			sliderMin = '20vw';
			sliderMax = '36vw';
			resizeAll();
		}
	}
	else {
		// Mobile
		if (isMobile != 1) {
			isMobile = 1;
			sliderMin = '50vw';
			sliderMax = '90vw';
			resizeAll();
		}
	}
}

function resizeAll() {

	if(myTaursTotal){

		for (i = 0; i < myTaursTotal; i++) {
			if (i+1 == myTaursCurrent) {
				$('#slideritem' + myTaursCurrent).css('width', sliderMax);
				$('#slideritem' + myTaursCurrent).css('height', sliderMax);
			}
			else {
				aux = i + 1;
				$('#slideritem' + aux).css('width', sliderMin);
				$('#slideritem' + aux).css('height', sliderMin);
			}
		}
		reposBody();

	}
	
}

function myPrevTaur() {
	if (myTaursCurrent > 1) {
		$('#slideritem' + myTaursCurrent).css('width', sliderMin);
		$('#slideritem' + myTaursCurrent).css('height', sliderMin);
		myTaursCurrent--;
		$('#infonumber').html(myTaursCurrent + ' out of ' + myTaursTotal + ' ');
		checkArrows();
		$('#slideritem' + myTaursCurrent).css('width', sliderMax);
		$('#slideritem' + myTaursCurrent).css('height', sliderMax);
		if (myTaursCurrent > 1) {
			// Si no es el primero, llevo a escala media al que tiene a su izquierda
			aux = myTaursCurrent-1;
			$('#slideritem' + aux).css('width', sliderMin);
			$('#slideritem' + aux).css('height', sliderMin);
		}
		reposBody();
		updateInfo();
	}
}

function myNextTaur() {
	if (myTaursCurrent < myTaursTotal) {
		$('#slideritem' + myTaursCurrent).css('width', sliderMin);
		$('#slideritem' + myTaursCurrent).css('height', sliderMin);
		myTaursCurrent++;
		$('#infonumber').html(myTaursCurrent + ' out of ' + myTaursTotal);
		checkArrows();
		$('#slideritem' + myTaursCurrent).css('width', sliderMax);
		$('#slideritem' + myTaursCurrent).css('height', sliderMax);
		if (myTaursCurrent < myTaursTotal) {
			// Si no es el último, llevo a escala media al que tiene a su derecha
			aux = myTaursCurrent+1;
			$('#slideritem' + aux).css('width', sliderMin);
			$('#slideritem' + aux).css('height', sliderMin);
		}
		reposBody();
		updateInfo();
	}
}

function checkArrows() {
	// Calculo si las flechas deben o no ser visibles
	if (myTaursCurrent < 2) {
		$('#sliderleft').css('opacity', '0');
		$('#sliderleftm').css('opacity', '0');
	} else {
		$('#sliderleft').css('opacity', '100');
		$('#sliderleftm').css('opacity', '100');
	}
	if (myTaursCurrent == myTaursTotal) {
		$('#sliderright').css('opacity', '0');
		$('#sliderrightm').css('opacity', '0');
	} else {
		$('#sliderright').css('opacity', '100');
		$('#sliderrightm').css('opacity', '100');
	}
}

function reposBody() {
	// if there's only one taur, position is different
	if (myTaursTotal != 1) {
		if (isMobile != 1) {
			posBody = (myTaursCurrent * -22) + 44 - (pixelDensity * (myTaursCurrent-1) * 4) + (pixelDensity * 4);
		}
		else {
			posBody = (myTaursCurrent * -52) + 52 - (pixelDensity * (myTaursCurrent-1) * 4) + (pixelDensity * 4);
		}
	}
	else {
		if (isMobile != 1) {
			posBody = 22 - (pixelDensity * (myTaursCurrent-1) * 4) + (pixelDensity * 4);
		}
		else {
			posBody = (pixelDensity * (myTaursCurrent-1) * 4) + (pixelDensity * 4);
		}
	}
	$('#sliderbody').css('left', posBody + 'vw');
}

function calcPixelDensity() {
	// Obtengo el tamaño de pantalla y lo uso para calcular la relación pixel-viewportwidth
	pixelDensity = 100 / window.innerWidth;
}

function updateInfo() {
	$('#skin').text(skins[myTaursCurrent-1]);
	$('#horns').text(horns[myTaursCurrent-1]);
	$('#collar').text(collars[myTaursCurrent-1]);
	$('#shirt').text(shirts[myTaursCurrent-1]);
	$('#background').text(backs[myTaursCurrent-1]);
	$('#hair').text(hairs[myTaursCurrent-1]);
	$('#eyes').text(eyes[myTaursCurrent-1]);
	$('#snout').text(snouts[myTaursCurrent-1]);
	$('#earring').text(earrings[myTaursCurrent-1]);
	$('#tatoo').text(tatoos[myTaursCurrent-1]);
	$('#id').text(id[myTaursCurrent-1]);
}

/*function myTaursAddTaur(taurRarity, taurImg, taurSkin, taurHorns, taurCollar, taurShirt, taurBack, taurHair, taurEyes, taurSnout, taurEarrings, taurTatoos, taurID) {
	
	myTaursTotal++;
	// If this is the first one to be added, update some values and erase "no taurs yet" message
	if (myTaursTotal == 1) {
		myTaursCurrent = 1;
		$('#notaursyet').remove();
	}
	// Push new values into arrays
	skins.push(taurSkin);
	horns.push(taurHorns);
	collars.push(taurCollar);
	shirts.push(taurShirt);
	backs.push(taurBack);
	hairs.push(taurHair);
	eyes.push(taurEyes);
	snouts.push(taurSnout);
	earrings.push(taurEarrings);
	tatoos.push(taurTatoos);
	id.push(taurID);
	// Update total counts
	if (taurRarity == "common") {
		count_common++;
		$('#count_common').html(count_common);
	}
	else if (taurRarity == "bronze") {
		count_bronze++;
		$('#count_bronze').html(count_bronze);
	}
	else if (taurRarity == "silver") {
		count_silver++;
		$('#count_silver').html(count_silver);
	}
	else if (taurRarity == "gold") {
		count_gold++;
		$('#count_gold').html(count_gold);
	}
	else if (taurRarity == "diamond") {
		count_diamond++;
		$('#count_diamond').html(count_diamond);
	}
	$('#count_total').html('Total: ' + myTaursTotal);
	// Add a slider module with the image
	var moduletxt = '<div class="slidermodule" id="slidermodule' + myTaursTotal + '">"';
	moduletxt += '<div class="slideritem" id="slideritem' + myTaursTotal + '" ';
	moduletxt += 'style="background-image: url(\'' + taurImg + '\'); ';
	// if this is the first item, then size must be 36vw, otherwise must be 20vw
	if (myTaursTotal == 1) {
		moduletxt += 'width: 36vw; height: 36vw"></div></div>';
	} else {
		moduletxt += 'width: 20vw; height: 20vw"></div><div id="skin"></div></div>';
	}

	$('#sliderbody').append(moduletxt);
	// Update information section (only if it's the first item to be added)


	
	if (myTaursTotal == 1) {				

		$('#skin').html(taurSkin);
		$('#horns').html(taurHorns);
		$('#collar').html(taurCollar);
		$('#shirt').html(taurShirt);
		$('#background').html(taurBack);
		$('#hair').html(taurHair);
		$('#eyes').html(taurEyes);
		$('#snout').html(taurSnout);
		$('#earring').html(taurEarrings);
		$('#tatoo').html(taurTatoos);
		$('#id').html(taurID);
		reposBody();
	}
	checkArrows();
}*/

function myTaursAddTaur(taurRarity, taurName, taurImg , taurSkin , taurHorns , taurCollar , taurShirt , taurBack , taurHair , taurEyes , taurSnout , taurEarrings , taurTatoos , taurID) {    
	
	var moduletxt = '<div class="result_module" style="background-image: url(\'';
	moduletxt += taurImg;
	moduletxt += '\')"  onclick="PopUpOpen(\'' + taurRarity + '\',\'' + taurName + '\',\'' + taurImg + '\',\'' + taurSkin + '\',\'' + taurHorns + '\',\'' + taurCollar + '\',\'' + taurShirt + '\',\'' + taurBack + '\',\'' + taurHair + '\',\'' + taurEyes + '\',\'' + taurSnout + '\',\'' + taurEarrings + '\',\'' + taurTatoos + '\',\'' + taurID + '\')">#';
	moduletxt += taurID;
	moduletxt += ' <span class="viewdetails" onclick="PopUpOpen(\'' + taurRarity + '\',\'' + taurName + '\',\'' + taurImg + '\',\'' + taurSkin + '\',\'' + taurHorns + '\',\'' + taurCollar + '\',\'' + taurShirt + '\',\'' + taurBack + '\',\'' + taurHair + '\',\'' + taurEyes + '\',\'' + taurSnout + '\',\'' + taurEarrings + '\',\'' + taurTatoos + '\',\'' + taurID + '\')"">view details</span>';
	moduletxt += '</div> ';
	$('#taurscontainer1').prepend(moduletxt);	
    
}
