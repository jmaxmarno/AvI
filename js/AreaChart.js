class AreaChart{
    /**
     * Creates a Bubble plot Object
     */
    constructor(allData, histData) {
        this.allData = allData;
        this.histData = histData;
        console.log(histData)
        this.hist = {
            'width':  1200,
            'height' : 300
        };
        this.area = {
            'width': 1200,
            'height': 700
        }
        this.createAreaChart();
    };


    // Creates area chart layout
    createAreaChart(){
        this.createHistogram();
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
}