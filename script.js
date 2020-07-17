

window.onload = () => {
    getCountryData();
    getHistoricalData();
    getWorldCoronaData();
    loadSearchBox();
    var filtertext = document.querySelector('#myInput')
    filtertext.addEventListener('input',filtertable)
    filtertext.onblur = function(){
        filtertext.value = ""
    }
    filtertext.onfocus = function(){
        filtertext = document.querySelector('#myInput')
        filtertext.value = ""
        x = document.querySelector(".dropdown-content")
        x.style.display = 'block'
        resetDropdownValues()
        filtertable()
        for (i=0;i < allInfos.length;i++){
            allInfos[i].close()
        }
        map.setZoom(2)
       
    }
    
    window.addEventListener('click',clickOutside)

    
    getNewsFeed()
    
}
setTimeout(checkModal,10000)

document.addEventListener('DOMContentLoaded', function() {
    
    var tooltips = document.querySelector('.tooltip-span');
    var tableContainer = document.querySelector('.table-container');
    tableContainer.document.addEventListener('mouseover',(e)=>{

        
        
        var x = (e.clientX + 20) + 'px',
            y = (e.clientY + 20) + 'px';
        
        tooltips.style.top = y;
        tooltips.style.top = x;
    
    })
}, false);

 
var infofill = 0
var arrfill = 0
var allInfos = []
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
        center: {lat: 26.3351, lng: 17.2283},
        zoom: 2,
        styles: mapStyle
    });
    infoWindow = new google.maps.InfoWindow();
}

const changeDataSelection = (casesType) => {
    
    clearTheMap();
    showDataOnMap(coronaGlobalData, casesType);
    
}
//clear old chart and update with new values
const clearLineChart = (casesType)=>{
 chart.destroy()
 changeDataSelection(casesType)
}

function toggleActive(element,color,num,type){
    
var status = document.querySelectorAll('.activemap')
highlight = document.querySelectorAll('.highlight')

for(i = 0;i<status.length;i++){
    status[i].classList.toggle('activemap')
   
}
element.classList.toggle('activemap')

highlight[num].style.background = color;

  clearLineChart(type)
  getHistoricalData(type)
}

const clearTheMap = () => {
    for(let circle of mapCircles){
        circle.setMap(null);
    }
}

//getting news feeds
const getNewsFeed = ()=>{
    fetch("https://www.who.int/rss-feeds/news-english.xml")
    .then(function(resp){
        return resp.text();
    })
    .then(function(data){
        let parser = new DOMParser(),
        xmlDoc = parser.parseFromString(data, 'text/xml');
        description = xmlDoc.getElementsByTagName('description');
        publishedDate = xmlDoc.getElementsByTagName('pubDate');
        title = xmlDoc.getElementsByTagName('title');
       
        
        newsFeed = document.getElementById('news-feed');
        PD = document.getElementById('publishe-date');
        newsEle = document.getElementById('heading')
        newsTitle = title[1].textContent;
         str = description[1].innerHTML;
       
         
        newsFeed.innerHTML = str
        str2 = newsFeed.innerText
       
        newsFeed.innerHTML = str2
        PD.innerHTML = publishedDate[1].textContent
      newsEle.innerHTML = newsTitle

      ////news feed 2

      newsFeed = document.getElementById('news-feed2');
        PD = document.getElementById('publishe-date2');
        newsEle = document.getElementById('heading2')
        newsTitle = title[2].textContent;
         str = description[2].innerHTML;
       
         
        newsFeed.innerHTML = str
        str2 = newsFeed.innerText
       
        newsFeed.innerHTML = str2
        PD.innerHTML = publishedDate[2].textContent
      newsEle.innerHTML = newsTitle


      /////news feed 3

      newsFeed = document.getElementById('news-feed3');
        PD = document.getElementById('publishe-date3');
        newsEle = document.getElementById('heading3')
        newsTitle = title[3].textContent;
         str = description[3].innerHTML;
       
         
        newsFeed.innerHTML = str
        str2 = newsFeed.innerText
       
        newsFeed.innerHTML = str2
        PD.innerHTML = publishedDate[2].textContent
      newsEle.innerHTML = newsTitle
       
    })
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
const loadSearchBox = () => {
    var searchHTML = "";
    fetch("https://corona.lmao.ninja/v2/countries")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
       
        data.forEach((country)=>{
            searchHTML += `<a onclick="addTextToinput(this)" href="#">${country.country}</a>`
        })
        document.getElementById('myDropdown').innerHTML = searchHTML
        
    })
}

const getWorldCoronaData = () => {
    fetch("https://disease.sh/v2/all")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        buildPieChart(data);
        loadButtons(data)
    })
}
const loadButtons=(data)=>{
    ////adding totals to buttons
    total_number = document.querySelector('.total-number');
    active_number = document.querySelector('.active-number');
    recovered_number = document.querySelector('.recovered-number');
    deaths_number = document.querySelector('.deaths-number');

    total_number.innerText = numeral(`${data.cases}`).format('0a').toUpperCase();
   
    recovered_number.innerText = numeral(`${data.recovered}`).format('0a').toUpperCase()
    deaths_number.innerText = numeral(`${data.deaths}`).format('0a').toUpperCase()
    //------------------------------------------------------
    // adding todays changes
     todaysTotals = document.querySelector('.todays-cases')
     todaysRecovered = document.querySelector('.todays-recoverd')
     todaysDeaths = document.querySelector('.todays-deaths')

     todaysTotals.innerHTML = numeral(data.todayCases).format('+0,0')
     todaysRecovered.innerHTML = numeral(data.todayRecovered).format('+0,0')
     todaysDeaths.innerHTML = numeral(data.todayDeaths).format('+0,0')

}

const getHistoricalData = (type) => {
   
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
            
            Tableres = {
            flag: country.countryInfo.flag,  
            country: country.country,
            cases: country.cases,
            recovered: country.recovered,
            deaths: country.deaths,
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
            }
            
        
            arr.push(Tableres)
      
            Tableres += Tableres
        }
       
        var html = `
            <div class="info-container">
                <div class="info-flag" style="background-image: url(${country.countryInfo.flag});background-position: center;">
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
            position: countryCircle.center,
            title: country.country
        });
        
        if (infofill == 0){
             allInfos.push(infoWindow)
        }
        google.maps.event.addListener(countryCircle, 'mouseover', function() {
            infoWindow.open(map);
        });

        google.maps.event.addListener(countryCircle, 'mouseout', function(){
            infoWindow.close();
        })

    })
    arrfill = 1
    infofill = 1
}

const showDataInTable = (data) => {
    var html = '';
    data.forEach((country)=>{
       

        html += `
        <tr>
            <td class="first-td hide"><img class="flag-table" src= ${country.countryInfo.flag}></td>
            <td>${thousands_separators(country.country)}</td>
            <td>${thousands_separators(country.cases)}</td>
            <td>${thousands_separators(country.recovered)}</td>
            <td>${thousands_separators(country.deaths)}</td>
        </tr>
        `
    })
    document.getElementById('table-data').innerHTML = html;
    table = document.getElementById("tip");
    tr = table.getElementsByTagName("tr");
    tablelisterer()
    
    

}

function filtertable() {
  
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
  function filtertable2() {
    
     var input, filter, table, tr, td, i, txtValue;
     input = document.getElementById("myInput2");
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
     table = document.getElementById("tip");
    tr = table.getElementsByTagName("tr");
    tablelisterer()
    

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
  table = document.getElementById("tip");
    tr = table.getElementsByTagName("tr");
    tablelisterer()
    

} 

   }
   displayNewTable = (arr,col) =>{
    var dataInfo = ""
     for (i = 0;i<arr.length-1;i++){

     
    dataInfoadd = `
    
    <tr>
            <td class="first-td hide"><img class="flag-table" src= ${arr[i].flag}></td>
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

   function test(el,item){
    var x = document.getElementById(item);
    
    if (window.getComputedStyle(x).display ==="none") {
       
        x.style.display = 'block'
        el.classList.value = 'fa fa-times-circle open-close'
        el.parentElement.scrollIntoView()
    }else{
       x.style.display = 'none'
       el.classList.value = 'fa fa-plus-circle open-close'
    }

   }

   const tablelisterer = ()=> {
    table = document.getElementById("tip");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        tr[i].addEventListener('click',function(){
              country = (this.childNodes[1].nextSibling.parentElement.cells[1].childNodes[0].data)
              arr.forEach((countryItem)=>{
                  if (countryItem.country == country){
                      lat = countryItem.lat
                      lng = countryItem.lng
                      map.setCenter({lat:lat,lng:lng})
                      map.setZoom(3)
                      openWindow(country)
                  }
              })
             
              
              
        })
    }
   }
   function openWindow(country) {
       
    for (i=0;i < allInfos.length;i++){
        allInfos[i].close()
    }
    
        allInfos.forEach((item)=>{
            if (item.title == country){
            item.open(map);
            
            }
        })
        
    
}

const refreash = ()=>{
    var filtertext = document.querySelector('#myInput')
    var filtertext2 = document.querySelector('#myInput2')
    filtertext.value = ""
    
    for (i=0;i < allInfos.length;i++){
        allInfos[i].close()
    }
    map.setCenter({lat: 26.3351, lng: 17.2283})
    map.setZoom(2)
    filtertable()

}
const dropdown = (e)=>{
    x = document.querySelector(".dropdown-content")
    
    if(e.target.parentElement.classList.value != "col dropdown"){
        x.style.display = 'none'
    }
    
}
function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }
  const addTextToinput = (item)=>{
    
    input = document.getElementById("myInput")
    input.value = item.innerText
    filtertable()
    arr.forEach((countryItem)=>{
        if (countryItem.country == input.value){
            lat = countryItem.lat
            lng = countryItem.lng
            map.setCenter({lat:lat,lng:lng})
            map.setZoom(3)
            openWindow(input.value)
        }
    })
  }

  const resetDropdownValues = ()=>{
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0;i < a.length;i++){
        a[i].style.display = ""
    }
  }

  const closeModal=()=>{
     
     modal.style.display = 'none'
     localStorage.setItem('helpViewed','ok')
  }

  function checkModal () {
      
    if (localStorage.getItem('helpViewed') == null){
        
     modal.style.display = 'flex'
     
    }
  }
  function clickOutside  (e){
     
    if(e.target == modal){
        modal.style.display = 'none'
        localStorage.setItem('helpViewed','ok')
    }
  }