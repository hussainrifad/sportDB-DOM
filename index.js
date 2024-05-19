// finding player URL
const playersURL = 'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=';
let playersData = [];

// finding player by palyerID
const playerURL = 'https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=';

const cart = {
    totalPlayers : 0,
    femalePlayers : 0,
    malePlayers : 0,
    list : []
}

// adding to cart function 

function add_to_cart(player){
    
    cart.list.push(player);
    if(player.strGender == 'Male'){
        cart.malePlayers += 1;
    }
    else if(player.strGender == 'Female'){
        cart.femalePlayers += 1;
    }
    cart.totalPlayers += 1;
}

// data fecthing function
const fetchData = async(url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

const handleAddToCart = async(id) => {
    const data = await fetchData(playerURL+id);
    const player = data.players[0];
    if(cart.totalPlayers < 12){
        const isYes = cart.list.find((pl) => pl.idPlayer === player.idPlayer);
        if(isYes){
            window.alert('this player is already added');
            return
        }
        add_to_cart(player);
        const t_players = document.getElementById('t-players');
        const f_players = document.getElementById('f-players');
        const m_players = document.getElementById('m-players');
        t_players.innerText = cart.totalPlayers;
        f_players.innerText = cart.femalePlayers;
        m_players.innerText = cart.malePlayers;

        const parent = document.getElementById('player-list');
        const child = document.createElement('div');
        child.innerHTML = `
            <p>${player.strPlayer}</p>
            <p>${player.strSport}</p>
        `
        child.classList.add('d-flex', 'justify-content-between');
        parent.appendChild(child);
    }
    else{
        window.alert('maximum amount of players is 11')
    }

}

const openModal = (player) => {
    const parent = document.getElementById('modal-box');
    const child = document.createElement('div');
    child.innerHTML = `
    <div id="modal-start" tabindex="-1">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            <p>Modal body text goes here.</p>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
            </div>
        </div>
        </div>
    </div>
    `
    parent.appendChild(child);
}

const handleDetail = async(id) => {
    const data = await fetchData(playerURL+id);
    const player = data.players[0];
    openModal(player)

}

const showPlayers = async(key) => {
    const data = await fetchData(playersURL+key);
    playersData = data.player;
    const cardParent = document.getElementById('card-parent');
    if(cardParent.hasChildNodes()){
        cardParent.innerHTML = `<div></div>`
    }
    for(let p of playersData){
        const children = document.createElement('div');
        children.innerHTML = `
            <div class="card" style="width: 18rem;">
                <img src=${p.strThumb} class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${p.strPlayer}</h5>
                    <p class="card-text">${p.strDescriptionEN.slice(0, 150)}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Gender : ${p.strGender}</li>
                    <li class="list-group-item">Nationality : ${p.strNationality}</li>
                    <li class="list-group-item">Sport : ${p.strSport}</li>
                    <li class="list-group-item">Weight : ${p.strWeight}</li>
                </ul>
                <div class="card-body">
                    <button class="btn btn-danger" onclick={handleAddToCart(${p.idPlayer})}>Add to Cart</button>
                    <button class="btn btn-primary" onclick={handleDetail(${p.idPlayer})} >View Detail</button>
                </div>
            </div>
        `
        children.classList.add('col-md-4');
        cardParent.append(children);
    }
}

const searchButton = document.getElementById('search-button');
searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    const searchBox = document.getElementById('search-box');
    const value = searchBox.value;
    showPlayers(value);
})