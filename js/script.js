/**
Jadie Adams and Max Marno
*/

d3.json('data/avalanches.json').then( data => {

	function getCountData(){
        let countData = []
        for (var year in data) {
            if (data.hasOwnProperty(year)) {  
                for (let month =1; month <= 12; month++){
                    if (month in data[year]){
                       countData.push({'year': year,'month': month, 'count': data[year][month]['total_count']});
                   }
                    else{
                        countData.push({'year': year, 'month': month, 'count': 0 });
                    }
                }          
            } 
        }
        countData.splice(0,10); // removing first nine months because csv started in Nov2009 not Jan2009
        countData.splice(-2,2); // removing Nov 2019 and Dec 2019
        return countData
    };

    countData = getCountData();
    const areaChart = new AreaChart(data, countData);

});
