

window.onload = () => {
    getCountryData();
    getHistoricalData();
    getWorldCoronaData();
    var filtertext = document.querySelector('#myInput')
    filtertext.addEventListener('input',filtertable)
    
}
document.addEventListener('DOMContentLoaded', function() {
    var tooltips = document.querySelector('.tooltip-span');
    var tableContainer = document.querySelector('.table-container');
    tableContainer.document.addEventListener('mouseover',(e)=>{

        // if(e.target.parentElement.parentElement = 'tr'){
        
        var x = (e.clientX + 20) + 'px',
            y = (e.clientY + 20) + 'px';
        // for (var i = 0; i < tooltips.length; i++) {
        //     tooltips[i].style.top = y;
        //     tooltips[i].style.left = x;
        // }
        tooltips.style.top = y;
        tooltips.style.top = x;
    // };
    })
}, false);
    

var arrfill = 0
var asc = 0
var arr = []
var newtype;
var map;
var infoWindow;
let coronaGlobalData;
let mapCircles = [];
var casesTypeColors = {
    cases: '#1d2c4d',
    active: '#9d80fe',
    recovered: '#7dd71d',
    deaths: '#fb4443'
}
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.8283, lng: -98.5795},
        zoom: 3,
        styles: mapStyle
    });
    infoWindow = new google.maps.InfoWindow();
}

const changeDataSelection = (casesType) => {
    clearTheMap();
    showDataOnMap(coronaGlobalData, casesType);
    
}

function toggleActive(element){
var status = document.querySelectorAll('.active')
for(i = 0;i<status.length;i++){
    status[i].classList.toggle('active')
   
}
element.classList.toggle('active')
}

const clearTheMap = () => {
    for(let circle of mapCircles){
        circle.setMap(null);
    }
}

const getCountryData = () => {
    fetch("https://corona.lmao.ninja/v2/countries")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        coronaGlobalData = data;
        showDataOnMap(data);
        showDataInTable(data);
    })
}

const getWorldCoronaData = () => {
    fetch("https://disease.sh/v2/all")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        buildPieChart(data);
    })
}

const getHistoricalData = (type) => {
    console.log(type)
    fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=120")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        let chartData = buildChartData(data,type);
        buildChart(chartData,type,casesTypeColors[type]);
        
    })
}

const openInfoWindow = () => {
    infoWindow.open(map);
}

const showDataOnMap = (data, casesType="cases") => {

    data.map((country)=>{
        let countryCenter = {
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
        }

        var countryCircle = new google.maps.Circle({
            strokeColor: casesTypeColors[casesType],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: casesTypeColors[casesType],
            fillOpacity: 0.35,
            map: map,
            center: countryCenter,
            radius: country[casesType]
        });
       

        mapCircles.push(countryCircle);

        if(arrfill == 0){
            // var cases = numeral(`${country.cases}`).format('0,0');
            // var recovered = numeral(`${country.recovered}`).format('0,0');
            // var deaths = numeral(`${country.deaths}`).format('0,0');
            //console.log(country.countryInfo.flag)
            Tableres = {
            flag: country.countryInfo.flag,  
            country: country.country,
            cases: country.cases,
            recovered: country.recovered,
            deaths: country.deaths,
            }
            
        
            arr.push(Tableres)
      
            Tableres += Tableres
        }
       
        var html = `
            <div class="info-container">
                <div class="info-flag" style="background-image: url(${country.countryInfo.flag});">
                </div>
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-confirmed">
                    Total: ${thousands_separators(country.cases)}
                </div>
                <div class="info-recovered">
                    Recovered: ${thousands_separators(country.recovered)}
                </div>
                <div class="info-deaths">   
                    Deaths: ${thousands_separators(country.deaths)}
                </div>
            </div>
        `

        var infoWindow = new google.maps.InfoWindow({
            content: html,
            position: countryCircle.center
        });
        google.maps.event.addListener(countryCircle, 'mouseover', function() {
            infoWindow.open(map);
        });

        google.maps.event.addListener(countryCircle, 'mouseout', function(){
            infoWindow.close();
        })

    })
    arrfill = 1
}

const showDataInTable = (data) => {
    var html = '';
    data.forEach((country)=>{
        // var cases = numeral(`${country.cases}`).format('0,0');
        // var recovered = numeral(`${country.recovered}`).format('0,0');
        // var deaths = numeral(`${country.deaths}`).format('0,0');

        html += `
        <tr>
            <td class="first-td"><img class="flag-table" src= ${country.countryInfo.flag}></td>
            <td>${thousands_separators(country.country)}</td>
            <td>${thousands_separators(country.cases)}</td>
            <td>${thousands_separators(country.recovered)}</td>
            <td>${thousands_separators(country.deaths)}</td>
        </tr>
        `
    })
    document.getElementById('table-data').innerHTML = html;
}

function filtertable() {
    console.log('rfilter')
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("tip");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }

  sortNewTable = (att,col)=>{

    
     
    if (asc == 2) {asc = -1;} else {asc = 2;}
    if (asc ==2){
     for (let j = 0; j < arr.length; j++){
       let max_Obj = arr[j]
       let max_location = j;
       for (let i = j;i < arr.length;i++){
         if (arr[i][att] < max_Obj[att]){
          max_Obj = arr[i]
          max_location = i
         }
       }
       arr[max_location] = arr[j]
       arr[j] = max_Obj
     }
     

     displayNewTable(arr,col)

     return 
    }
else {
  for (let j = 0; j < arr.length; j++){
    let max_Obj = arr[j]
    let max_location = j;
    for (let i = j;i < arr.length;i++){
      if (arr[i][att] > max_Obj[att]){
       max_Obj = arr[i]
       max_location = i
      }
    }
    arr[max_location] = arr[j]
    arr[j] = max_Obj
  }
  

  displayNewTable(arr,col)

} 

   }
   displayNewTable = (arr,col) =>{
    var dataInfo = ""
     for (i = 0;i<arr.length-1;i++){

     
    dataInfoadd = `
    
    <tr>
            <td class="first-td"><img class="flag-table" src= ${arr[i].flag}></td>
            <td>${thousands_separators(arr[i].country)}</td>
            <td>${thousands_separators(arr[i].cases)}</td>
            <td>${thousands_separators(arr[i].recovered)}</td>
            <td>${thousands_separators(arr[i].deaths)}</td>
    </tr>
    
  `

    dataInfo = dataInfo + dataInfoadd
    
  };
  document.getElementById('table-data').innerHTML = dataInfo

  

  

  hdr = document.getElementById('tip').rows[0].cells[col];
  $('.sortorder').remove();
	if (asc == -1) {
		$(hdr).html($(hdr).html() + '<span class="sortorder">▲</span>');
		} else {
		$(hdr).html($(hdr).html() + '<span class="sortorder">▼</span>');
	}
     
   }

   function thousands_separators(num)
   {
     var num_parts = num.toString().split(".");
     num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     return num_parts.join(".");
   }
