

const buildChartData = (data,type) => {
     
    let chartData = [];
    if (type == 'cases'){
 
        for(let date in data.cases){
            let newDataPoint = {
                x: date,
                y: data.cases[date]
            }
            chartData.push(newDataPoint);
        }  
    }else if(type == 'recovered'){
        for(let date in data.recovered){
            let newDataPoint = {
                x: date,
                y: data.recovered[date]
            }
            chartData.push(newDataPoint);
        }  
    }else if(type == 'deaths'){
        for(let date in data.deaths){
            let newDataPoint = {
                x: date,
                y: data.deaths[date]
            }
            chartData.push(newDataPoint);
        } 
        
    }else {
        for(let date in data.cases){
            let newDataPoint = {
                x: date,
                y: data.cases[date]
            }
            chartData.push(newDataPoint);
        }  
    } 
    
    return chartData;
    
    
}

const buildChart = (chartData,type="Cases",color="1d2c4d") => {
    
    


    var timeFormat = 'MM/DD/YY';
    var ctx = document.getElementById('myChart').getContext('2d');
    
    chart = new Chart(ctx, {
        
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            datasets: [{
                label: `Total ${type}`,
                backgroundColor: color,
                borderColor: color,
                data: chartData,
                
            }]
        },
        
       
        // Configuration options go here
        options: {
            // maintainAspectRatio: true,
            maintainAspectRatio: true,
            responsive: true,
            tooltips: {
                mode: 'index',
                intersect: false
            },
            scales:     {
                xAxes: [{
                    type: "time",
                    time: {
                        format: timeFormat,
                        tooltipFormat: 'll'
                    }
                }],
                yAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return numeral(value).format('0a');
                        }
                    }
                }]
            }
        }
        
    });
    
}

const buildPieChart = (data) => {
    

    var ctx = document.getElementById('myPieChart').getContext('2d');
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [{
                data: [
                    
                    data.active, 
                    data.recovered, 
                    data.deaths,
                    
                ],
                backgroundColor: [
                    '#9d80fe',
                    '#7dd71d',
                    '#fb4443'
                ]
            }],
        
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Active',
                'Recovered',
                'Deaths'
            ]
        },
        options: {
            // maintainAspectRatio: true,
            maintainAspectRatio: true,
            responsive: true,
        },
        
        
    
    });
}
