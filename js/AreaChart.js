class AreaChart{
    /**
     * Creates a Bubble plot Object
     */
    constructor(allData, histData) {
        this.allData = allData;
        this.histData = histData;

        this.hist = {
            'width':  1200,
            'height' : 300
        };
        this.area = {
            'width': 1200,
            'height': 300
        }
        this.createHistogram();
        let areaData = this.getAreaData("size");
        this.createAreaChart(areaData);
    };


    // Creates area chart layout
    createAreaChart(areaData){
        let that = this
        // svg
        let areaSVG = d3.select('#areachart').append('svg')
            .attr("width", this.area.width)
            .attr("height", this.area.height);
        //border
        areaSVG.append("rect")
            .attr("width", this.area.width)
            .attr("height", this.area.height);
        console.log(areaData)
        let areaGroups = areaSVG.selectAll("g").data(areaData);
        let enterArea = areaGroups.enter().append("g");
        areaGroups.exit().remove();
        areaGroups = enterArea.merge(areaGroups);
        let rectWidth = this.area.width/areaData.length;
        let areaRects = areaGroups.selectAll("rect")
            .data((d,i) => this.getRectData(d,i))
            .enter()
            .append("rect");
        areaRects.attr("width", rectWidth)
            .attr("height", (d) => d.proportion*this.area.height)
            .attr('x', (d,i) => d.index * 10)
            .attr('class', (d) => d.name);
    }

    createHistogram(){
        let that = this
        // svg
        let histSVG = d3.select('#histogram').append('svg')
            .attr("width", this.hist.width)
            .attr("height", this.hist.height);
        //border
        histSVG.append("rect")
            .attr("width", this.hist.width)
            .attr("height", this.hist.height);
        let histBars = histSVG.append("g").attr('id', 'histBars');
        let bars = histBars.selectAll("rect").data(this.histData);    //update
        let enterBars = bars.enter().append("rect");
        bars.exit().remove();
        bars = enterBars.merge(bars);
        let barWidth = this.hist.width/this.histData.length
        bars.attr('x', (d,i) => i * barWidth)
            .attr('y', (d) => that.hist.height-d.count)
            .attr('width',barWidth)
            .attr('height', (d) => d.count);
        bars.on('click', function(d, i) {
            console.log("Year: " + d.year + " Month: " + d.month);
        });
    }
    

    drawAreaChart(data){

    }

    getAreaData(category){
        console.log(category)
        let areaData = []
        for (var year in this.allData) {
            if (this.allData.hasOwnProperty(year)) {  
                for (let month =1; month <= 12; month++){
                    if (month in this.allData[year]){
                        console.log(category)
                        areaData.push({'year': year,'month': month, 'count': this.allData[year][month]['total_count'], "categoryName": category, "categories" : this.allData[year][month][category]});
                   }
                    else{
                        areaData.push({'year': year, 'month': month, 'count': 0,"categoryName": category, "categories": {}});
                    }
                }          
            } 
        }
        areaData.splice(0,10); // removing first nine months because csv started in Nov2009 not Jan2009
        areaData.splice(-2,2); // removing Nov 2019 and Dec 2019
        return areaData
    };

    getRectData(instance, index){
        let rectData = []
        console.log(instance)
        if (instance.count > 0){
            for (let name in instance.categories) {
                let proportion = instance.categories[name]/instance.count;
                rectData.push({"name": name, "proportion": proportion, "index": index});
            }
        }
        console.log(rectData)
        return rectData
    }
}