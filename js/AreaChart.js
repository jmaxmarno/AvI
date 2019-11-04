class AreaChart{
    /**
     * Creates a Bubble plot Object
     */
    constructor(data, histData) {
        this.data = data;
        this.histData = histData
        console.log(histData)

        this.hist = {
            'width':  1200,
            'height' : 300
        };
        this.area = {
            'width': 1200,
            'height': 300
        }

        this.createHistogram();
        this.createAreaChart("trigger");
    };

    createHistogram(){
        let that = this;
        // svg
        let histSVG = d3.select('#histogram').append('svg')
            .attr("width", this.hist.width)
            .attr("height", this.hist.height);
        //border
        histSVG.append("rect")
            .attr("width", this.hist.width)
            .attr("height", this.hist.height)
            .attr("class", "border");
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

    // Creates area chart layout
    createAreaChart(attribute){
        let areaData = this.getAreaData(attribute);
        let that = this;
        // svg
        let areaSVG = d3.select('#areachart').append('svg')
            .attr("width", this.area.width)
            .attr("height", this.area.height);
        //border
        areaSVG.append("rect")
            .attr("width", this.area.width)
            .attr("height", this.area.height)
            .attr("class", "border");
        // bar scales
        const xBarScale = d3.scaleLinear()
            .domain([0, areaData.length])
            .range([0, this.area.width]);
        const yBarScale = d3.scaleLinear()
            .domain([0,1])
            .range([this.area.height,0]);
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        //define series
        console.log(areaData)
        const columns = Object.keys(areaData[0]);
        let series = d3.stack().keys(columns.slice(1))(areaData);
   
        const rects = areaSVG.selectAll("g").data(series).enter()
            .append("g")
            .style("fill", d => color(d.key));
          
        rects.selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", (d, i) => xBarScale(i))
            .attr("y", d=> yBarScale(d[1]))
            .attr("height",d=> yBarScale(d[0]) - yBarScale(d[1]))
            .attr("width", 10);
    }

    getAreaData(category){
        let areaData = [];
        let allZeros = true;
        for (let year in this.data) {
            for (let month in this.data[year]) {
                let date = month +'/'+ year;
                let dict = {'date': date};
                let count = this.data[year][month]["total_count"];
                for (let label in  this.data[year][month][category]){
                    let proportion;
                    if (count != 0){
                        proportion = this.data[year][month][category][label] / count;
                        allZeros = false;
                    }
                    else{
                        proportion = 0;
                    }
                    dict[label] = proportion;
                }
                if (allZeros == true){
                    dict["none"] = 1
                }
                else{
                    dict["none"] = 0
                }
                areaData.push(dict) ;     
            } 
        }
        return areaData;
    };

}