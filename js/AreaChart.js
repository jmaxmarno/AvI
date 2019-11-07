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
            'height' : 100
        };
        this.area = {
            'width': 1200,
            'height': 300
        }

        this.attributes = ["trigger", "aspect", "size", "elevation"];
        this.ordinal = ["size", "elevation"];

        this.sortedLabels = {};
        this.setSortedLabels();

        this.createHistogram();
        this.createAreaChart("trigger");
        this.createDropDown();
    };

    setSortedLabels(){
        // get a valid year and month
        let year = Object.keys(this.data)[0];
        let month = Object.keys(this.data[year])[0];
        // nominal should be sorted by largest value
        this.sortedLabels["trigger"] = this.sortCategory("trigger");
        this.sortedLabels["aspect"] = this.sortCategory("aspect");
        // ordinal should be in the right order already
        this.sortedLabels["size"] = Object.keys(this.data[year][month]["size"]);
        this.sortedLabels["elevation"] = Object.keys(this.data[year][month]["elevation"]);   
    }

    sortCategory(category){
        let startYear = Object.keys(this.data)[0];
        let startMonth = Object.keys(this.data[startYear])[0];
        let labels = Object.keys(this.data[startYear][startMonth][category]);
        let count_dict = {};
        for (let index = 0; index < labels.length; index++){
            count_dict[labels[index]] = 0;
        }
        // set
        for (let year in this.data) {
            for (let month in this.data[year]) {
                for (let index = 0; index < labels.length; index++){
                    count_dict[labels[index]] = count_dict[labels[index]] + this.data[year][month][category][labels[index]];
                }
            }
        }
        //sort
        let sorted_labels = Object.keys(count_dict).sort(function(a, b) {
          return count_dict[b] - count_dict[a];
        })
        return sorted_labels;

    }

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
            .attr("class", "border")
        //scale
        let xHistScale = d3.scaleLinear()
            .domain([0, this.histData.length])
            .range([0, this.hist.width]);
        let maxCount = d3.max(this.histData, (d) => d.count);
        let yHistScale = d3.scaleLinear()
            .domain([0,maxCount])
            .range([0, this.hist.height-10]);
        let histBars = histSVG.append("g").attr('id', 'histBars');
        let bars = histBars.selectAll("rect").data(this.histData);    //update
        let enterBars = bars.enter().append("rect");
        bars.exit().remove();
        bars = enterBars.merge(bars);
        let barWidth = this.hist.width/this.histData.length
        bars.attr('x', (d,i) => xHistScale(i))
            .attr('y', (d) => this.hist.height - yHistScale(d.count))
            .attr('width',barWidth)
            .attr('height', (d) => yHistScale(d.count));
        bars.on('click', function(d, i) {
            console.log("Year: " + d.year + " Month: " + d.month);
        });
    }

    // Creates area chart layout
    createAreaChart(attribute){
        // svg
        let areaSVG = d3.select('#areachart').append('svg')
            .attr("width", this.area.width)
            .attr("height", this.area.height)
            .attr("id", "areaSVG");
        //border
        areaSVG.append("rect")
            .attr("width", this.area.width)
            .attr("height", this.area.height)
            .attr("class", "border");

        //define series
        let areaData = this.getAreaData(attribute);
        let columns = Object.keys(areaData[0]);
        let series = d3.stack().keys(columns.slice(1))(areaData); // don't include date

        // bar scales
        let xBarScale = d3.scaleLinear()
            .domain([0, areaData.length])
            .range([0, this.area.width]);
        let yBarScale = d3.scaleLinear()
            .domain([0,1])
            .range([this.area.height,0]);
        let color = d3.scaleOrdinal(d3.schemeCategory10);

        // add bars
        let catGroups = areaSVG.selectAll("g").data(series).enter()
            .append("g")
            .style("fill", d => color(d.key));
        catGroups.selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", (d, i) => xBarScale(i))
            .attr("y", d=> yBarScale(d[1]))
            .attr("height",d=> yBarScale(d[0]) - yBarScale(d[1]))
            .attr("width", 10)
            .on('click', function(d, i) {
                console.log(d);
            });;
    }

    updateAreaChart(attribute){
        let areaSVG = d3.select("#areaSVG")

        //define series
        let areaData = this.getAreaData(attribute);
        let columns = Object.keys(areaData[0]);
        let series = d3.stack().keys(columns.slice(1))(areaData); // don't include date

        // bar scales
        let xBarScale = d3.scaleLinear()
            .domain([0, areaData.length])
            .range([0, this.area.width]);
        let yBarScale = d3.scaleLinear()
            .domain([0,1])
            .range([this.area.height,0]);
        let color = d3.scaleOrdinal(d3.schemeCategory10);

        // add bars
        let catGroups = areaSVG.selectAll("g").data(series);
        let catEnter = catGroups.enter().append("g").style("fill", d => color(d.key));
        catGroups.exit()
            .style("opacity", 1)
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove();
        catGroups = catEnter.merge(catGroups);
        let catRects = catGroups.selectAll("rect").data(d => d);
        let catRectsEnter = catRects.enter().append("rect");
        catRects.exit().remove();
        catRects = catRectsEnter.merge(catRects);
        catRects.attr("x", (d, i) => xBarScale(i))
            .attr("y", d=> yBarScale(d[1]))
            .attr("height",d=> yBarScale(d[0]) - yBarScale(d[1]))
            .attr("width", 10);
        catGroups.transition()
            .duration(500)
            .style("opacity", 1);
    }

    getAreaData(category){
        let areaData = [];
        let allZeros = true;
        let labels = this.sortedLabels[category];
        for (let year in this.data) {
            for (let month in this.data[year]) {
                let date = month +'/'+ year;
                let dict = {'date': date};
                let count = this.data[year][month]["total_count"];
                for (let index = 0; index < labels.length; index++){
                    let label = labels[index];
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
        // console.log(areaData)
        return areaData;
    };



    createDropDown(){
        let that = this;

        let section = d3.select('#dropdown').append('svg')
            .attr("width",300)
            .attr("height", 300);

        let labels = section.selectAll("text").data(this.attributes).enter().append("text")
            .text((d) => d)
            .attr("x", 50)
            .attr("y", (d,i) => (i*50)+20)
            .on('click', function(d, i) {
                that.updateAreaChart(d)
            });
    }

}