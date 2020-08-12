var mainContent = document.querySelector('#main_content');

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Accept", "application/json");

var urlencoded = new URLSearchParams();
urlencoded.append("f", "json");
urlencoded.append("where", "Architect = 'John Lautner'");
urlencoded.append("outSr", "4326");
urlencoded.append("outFields", "OBJECTID,architect,address,description,description2,image,name,year");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("https://services.arcgis.com/h1HPF81YCOI467An/arcgis/rest/services/modernist_test/FeatureServer/0/query", requestOptions)
    .then(response => response.json())
    .then(result => {
        const resultArray = result.features
        resultArray.map(house => populateHouses(house))
    })
    .catch(error => console.log('error', error));


function populateHouses(house){
    const houseOption = document.createElement('div');
    houseOption.classList.add('house-card')
    const houseLabel = document.createElement('h4');
    const houseDescription = createDescription(house)
    let images;
    if(house.attributes.image.includes(',')){
        images = house.attributes.image.split(',')
    }
    if(images) {
        images.map(image => createImage(image, houseOption))
    } else {
        createImage(house.attributes.image, houseOption)
    }
    houseLabel.innerText = `${house.attributes.name}`;
    houseOption.appendChild(houseLabel)
    houseOption.appendChild(houseDescription)
    mainContent.appendChild(houseOption)
}

function createDescription(house){
    const houseDescription = document.createElement('p');
    const houseDescription1 = document.createElement('span');
    
    houseDescription1.innerText = `${house.attributes.description} `;
    houseDescription.appendChild(houseDescription1);

    if(house.attributes.description2){
        const houseDescription2 = document.createElement('span');
        houseDescription2.innerText = `${house.attributes.description2}`;
        houseDescription.appendChild(houseDescription2);
    }
   
    return houseDescription;
}

function createImage(image, parent){
    const houseImage = document.createElement('img');
    houseImage.setAttribute('src', image)
    houseImage.classList.add('architect-image')
    parent.appendChild(houseImage)
}