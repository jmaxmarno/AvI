class AreaChart{
    /**
     * Creates a Bubble plot Object
     */
    constructor(data, histData, activeAttribute, activeTime, updateAttribute, colorfunction, summerfunction) {
        this.data = data;
        this.histData = histData
        this.activeAttribute = activeAttribute;
        this.activeTime = activeTime;
        this.updateAttribute = updateAttribute;
        this.updatesummer = summerfunction
        this.catcolor = colorfunction;
        this.showSummer = true;
        this.buffer = 30;
        let width = d3.select("#areachart").node().getBoundingClientRect().width - (this.buffer*3);
        this.hist = {'width': width,'height' : 100};
        this.area = {'width': width,'height': 200};
        this.months = {1:"January", 2:"February", 3:"March", 4:"April", 5:"May", 6:"June",
            7:"July", 8:"August", 9:"September", 10:"October", 11:"November", 12:"December"};
        this.attributes = ["trigger", "aspect", "width", "elevation"];
        this.sortedLabels = {};
        this.setSortedLabels();
        this.draw();
    };

    setAttribute(attribute){
        this.activeAttribute = attribute;
        this.updateAreaChart();
    }
    setTime(activeTime){
      console.log('SET TIME');
        this.activeTime = activeTime;
        this.updateHistogram();
        this.updateAreaChart();
    }

    // Creates area chart, histogram, and dropdown layout
    draw(){
        // set up for hist
        let histSvg = d3.select('#areachart').append('svg').attr('id', 'histSVG')
            .attr("width", this.hist.width+(2*this.buffer))
            .attr("height", this.hist.height+this.buffer+5);
        // axis
        let maxCount = d3.max(this.histData, (d) => d.count);
        let yAxisScale = d3.scaleLinear()
            .domain([maxCount,0])
            .range([5, this.hist.height]);
        let yAxis = d3.axisLeft();
        yAxis.scale(yAxisScale)
            .ticks(3);
        histSvg.append("g")
            .attr("id","yHistAxis")
            .attr("transform", "translate("+this.buffer+","+ this.buffer+")")
            .call(yAxis);
        d3.select("g#yHistAxis").select("path").remove(); // remove top tick
        // add plot
        let histPlot = histSvg.append("g").attr("transform", "translate("+this.buffer+","+this.buffer+")").attr("id", "histPlot");
        // border
        histPlot.append("rect")
            .attr("width", this.hist.width)
            .attr("height", this.hist.height)
            .attr("class", "border");
        // kernal density
        histPlot.append("path")
            .attr("id", "kd")
            .attr("fill", "LightBlue")
            .attr("opacity", "1")
            .attr("id", "kd")
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("stroke-linejoin", "round")
            .attr("d", "M 0 0 L 0 0 L 0 0 0 0");

        // set up for area chart
        let areaSVG = d3.select('#areachart').append('svg')
            .attr("width", this.area.width + (2*this.buffer))
            .attr("height", this.area.height);
        //plot
        let areaPlot = areaSVG.append("g").attr("transform", "translate("+this.buffer+",0)").attr("id", "areaPlot");
        //border
        areaPlot.append("rect")
            .attr("width", this.area.width)
            .attr("height", this.area.height)
            .attr("class", "border");
        let footnoteSVG = d3.select('#areachart').append('svg')
            .attr("width", this.area.width + (2*this.buffer))
            .attr("height", this.buffer);
        let footnote = footnoteSVG.append("g").attr("transform", "translate("+this.buffer/2+","+this.buffer/2+")");
        footnote.append('text')
                .attr("class", "footnote")
                .text("The histogram above shows the count of avalanche observations, binned by month, and stacked bar chart below that shows the relative proportions of the selected observation characteristic. Hover over the bars for more information.");

        // set up for drop down

        let dropdownWrap = d3.select('#dropdown-wrapper');
        let aWrap = dropdownWrap.append('div').classed('dropdown-panel', true);
        aWrap.append('div').classed('d-label', true)
            .append('text')
            .text('Select Characteristic:');
        aWrap.append('div').attr('id', 'dropdown_a').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        this.drawDropDown();
        this.checkBox();
        this.updateHistogram();
    }

    // draws histogram
    updateHistogram(){
        let that = this;
        let data = this.getAreaData();
        console.log('hist area data', data);
        //scales
        let xHistScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, this.hist.width]);
        let maxCount = d3.max(this.histData, (d) => d.count);
        let yHistScale = d3.scaleLinear()
            .domain([0,maxCount])
            .range([0, this.hist.height-5]);
         // kernel density
        let yAxisScale = d3.scaleLinear()
            .domain([maxCount,0])
            .range([5, this.hist.height]);
        let plot = d3.select("#histPlot");
        let lineGenerator = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return d.dims.xval + d.dims.width/2; })
            .y(function(d) { return yAxisScale(d.count); })
        let kd = plot.select("path#kd");
            kd.attr('d', lineGenerator(data))
                .style("opacity", 0)
                .transition()
                .duration(500)
                .style("opacity", 1);
        // bars
        //data = data.filter(function(d){return d.count != 0;});
        let barGroups = d3.select("#histPlot").selectAll("g").data(data);
        let barEnter = barGroups.enter().append("g");
        barEnter.append("line");
        barEnter.append("rect");
        barEnter.append("text");
        barGroups.exit().remove();
        barGroups = barEnter.merge(barGroups);
        barGroups.select("line")
            .attr('y1', 0)
            .attr('y2', function(d){
                let month = d.date.split("/")[0];
                if (month == 1){ return that.hist.height }
                else{ return 0}
            })
            .transition()
            .duration(500)
            .attr('x1', (d,i) => d.dims.xval)
            .attr('x2', (d,i) => d.dims.xval)
            .attr("class", "yearLine");
        barGroups.select("text")
            .attr('x', (d,i) => d.dims.xval)
            .attr('y', -this.buffer/2)
            .attr("class", "yearLabel")
            .text(function(d){
                let month = d.date.split("/")[0];
                let year = d.date.split("/")[1];
                if (that.showSummer && month == 5){ return year }
                if (!that.showSummer && month == 3){ return year }
                else{return ""}
            });
        barGroups.select("rect")
            .transition()
            .duration(500)
            .attr("x", d=> d.dims.xval)
            .attr('y', (d) => this.hist.height - yHistScale(d.count))
            .attr('height', (d) => yHistScale(d.count))
            .attr("width", d=> d.dims.width)
            .style("opacity", function(d){
                if(d.dims.zoomed == "in" || d.dims.zoomed == "noZoom"){ return 0.5; }
                else{ return 0.25; }
            })
            .attr("class", function(d){
                if(d.dims.zoomed == "in" || d.dims.zoomed == "noZoom"){
                     return "histBar in date"+String(d.date).replace("/","");
                }
                else{
                    return "histBar out date"+String(d.date).replace("/","");
                }
            });
        let rects = d3.select("#histPlot").selectAll("g").selectAll("rect");
        rects.on("mouseover", function(d) {
                let xPosition = parseFloat(d3.select(this).attr("x"));
                let yPosition = parseFloat(d3.select(this).attr("y"));
                let month = d.date.split("/")[0];
                let year = d.date.split("/")[1];
                let count = d.count;
                d3.select("#histPlot").append("title") //Create the tooltip label
                    .attr("id", "tooltip")
                    .attr("x", xPosition)
                    .attr("y", yPosition)
                    .text(function(d){
                        return that.months[month] + " " + year + "\n" + "Observation count: " + count;
                    });
                // highlight
                d3.selectAll(".date"+String(month)+String(year)).classed("highlightBar", true);
                d3.select('#areaPlot').selectAll('rect').style("opacity", 0.5);
                d3.select('#areaPlot').selectAll(".date"+String(month)+String(year)).style("opacity",1);
                d3.select('#histPlot').selectAll('rect').style("opacity", 0.25);
                d3.select('#histPlot').selectAll(".date"+String(month)+String(year)).style("opacity",0.5);
            })
            .on("mouseout", function() {//Remove the tooltip
                d3.select("#tooltip").remove();
                d3.selectAll(".highlightBar").classed("highlightBar", false);
                d3.select('#areaPlot').selectAll('.in').style("opacity", 1);
                d3.select('#histPlot').selectAll('.in').style("opacity", 0.5);
            });
    }

    // updates area chart with given attribute data
    updateAreaChart(){
        let that = this;
        let plot = d3.select("#areaPlot")
        //define series
        let areaData = this.getAreaData();
        console.log('area areadata', areaData);
        let columns = Object.keys(areaData[0]);
        let series = d3.stack().keys(columns.slice(3))(areaData); // don't include date or dimensions
        // bar scales
        let xBarScale = d3.scaleLinear()
            .domain([0, areaData.length])
            .range([0, this.area.width]);
        let yBarScale = d3.scaleLinear()
            .domain([0,1])
            .range([this.area.height,0]);
        let color = d3.scaleOrdinal(d3.schemeCategory10);
        // add bars
        let catGroups = plot.selectAll("g").data(series);
        let catEnter = catGroups.enter().append("g").style("fill", d => that.catcolor(that.activeAttribute, d.key));
        catGroups.exit().remove();
        catGroups = catEnter.merge(catGroups)
            .style("fill", d => that.catcolor(that.activeAttribute, d.key));

        let catRects = catGroups.selectAll("rect").data(function(d){
            for(let index = 0; index <d.length; index ++){
                d[index]["key"] = d.key;
            }
            return d;
        });
        let catRectsEnter = catRects.enter().append("rect")
            .attr("x", d=>d.data.dims.xval)
            .attr("width", d=>d.data.dims.width)
            .style("opacity", 0);
        catRects.exit()
            .style("opacity", 1)
            .transition()
            .duration(1000)
            .style("opacity", 0)
            .remove();
        catRects = catRectsEnter.merge(catRects);
        catRects.transition()
            .duration(500)
            .attr("x", d=>d.data.dims.xval)
            .attr("width", d=>d.data.dims.width)
            .attr("y", d=> yBarScale(d[1]))
            .attr("height",d=> yBarScale(d[0]) - yBarScale(d[1]))
            .attr("class", function(d){
                if(d.data.dims.zoomed == "in" || d.data.dims.zoomed == "noZoom"){
                     return "areaBar in date"+String(d.data.date).replace("/","");
                }
                else{
                    return "areaBar out date"+String(d.data.date).replace("/","");
                }
            })
            .style("opacity", function(d){
                if(d.data.dims.zoomed == "in" || d.data.dims.zoomed == "noZoom"){ return 1; }
                else{ return 0.5; }
            });
        catRects.on("mouseover", function(d) {
                let label = d.key;
                let percent = (d.data[label]*100).toFixed(1)
                var xPosition = parseFloat(d3.select(this).attr("x"));
                var yPosition = parseFloat(d3.select(this).attr("y"));
                let month = d.data.date.split("/")[0];
                let year = d.data.date.split("/")[1];
                plot.append("title") //Create the tooltip label
                    .attr("id", "tooltip")
                    .attr("x", xPosition)
                    .attr("y", yPosition)
                    .text(that.months[month] + " " + year + "\n" + label + ": " + percent + "%");
                // highlight
                d3.selectAll(".date"+String(d.data.date).replace("/","")).classed("highlightBar", true);
                d3.select('#areaPlot').selectAll('rect').style("opacity", 0.5);
                d3.select('#areaPlot').selectAll(".date"+String(d.data.date).replace("/","")).style("opacity",1);
                d3.select('#histPlot').selectAll('rect').style("opacity", 0.25);
                d3.select('#histPlot').selectAll(".date"+String(d.data.date).replace("/","")).style("opacity",0.5);
            })
            .on("mouseout", function() {//Remove the tooltip
                d3.select("#tooltip").remove();
                d3.selectAll(".highlightBar").classed("highlightBar", false);
                d3.select('#areaPlot').selectAll('.in').style("opacity", 1);
                d3.select('#histPlot').selectAll('.in').style("opacity", 0.5);
            });

        d3.select('#histPlot').selectAll('rect').selectAll(".zoomed_out").style("opacity", 0.5);
    }

    // gets area chart data with specified category
    getAreaData(){
        let that = this;
        let areaData = [];
        let labels = this.sortedLabels[this.activeAttribute];
        let activemonthscount = 0;
        let activeyears = [];
        // Date range stuff
        if(that.activeTime.length){
          activeyears = this.activeTime.map(d=>d.year)
          let wSummeractivemonths = this.activeTime.map(d=>d.months.length).reduce((a,b)=> a+b, 0)
          let noSummeractivemonths = that.activeTime.map(function(year){
            console.log('year', year.year);
            console.log('months', year.months);
            let mm = year.months.filter(function(m){
              console.log('m', m);
              let count = that.data[year.year][m]['total_count']
              // [month]["total_count"];
              console.log('count', count);
              if (count > 0){
                return m
              }
            })
            year.months = mm
            return year
            }).map(d=>d.months.length).reduce((a,b)=> a+b, 0)


          // }).map(d=>d.months.length).reduce((a,b)=> a+b, 0)
          if (that.showSummer === true){
            console.log('show summer true');
            console.log('len active', wSummeractivemonths);
            activemonthscount = noSummeractivemonths
            // activemonthscount = wSummeractivemonths
          }else{
            console.log('show summer false');
            console.log('len active', noSummeractivemonths);
            activemonthscount = noSummeractivemonths
          }
          // activemonthscount = that.showSummer === true?wSummeractivemonths:noSummeractivemonths;
        }

        console.log('time', this.activeTime);
        for (let year in this.data) {
            for (let month in this.data[year]) {
                let date = month +'/'+ year;
                let dict = {'date': date};
                dict.dims = {};
                let count = this.data[year][month]["total_count"];
                dict["count"] = count;
                let allZeros = true;
                for (let index = 0; index < labels.length; index++){
                    let label = labels[index];
                    let proportion;
                    if (count != 0){
                        proportion = (this.data[year][month][this.activeAttribute][label] / count).toFixed(3);
                        allZeros = false;
                    }
                    else{
                        proportion = 0;
                    }
                    dict[label] = proportion;
                }
                if (allZeros == true){
                    if (that.showSummer == true){
                        areaData.push(dict);
                    }
                }
                else{
                    areaData.push(dict);
                }
            }
        }
        // console.log('areaData',areaData)
        let total = areaData.length
        let widths = this.widthscale(total, activemonthscount, this.area.width)
        let dated = areaData.map(function(dd, i){
          let ddate = dd.date.split("/")
          let mmonth = ddate[0]
          let yyear = ddate[1]
          if(activeyears.includes(yyear)){
            let selmonths = that.activeTime.filter(d=>d.year==yyear)[0].months
            if(selmonths.includes(parseInt(mmonth))){
              dd.dims.width = widths[0];
              dd.dims.zoomed = "in";
            }else{
              dd.dims.width = widths[1];
              dd.dims.zoomed = "out";
            }
          }
          else{
            dd.dims.width = widths[1];
            if (activemonthscount == 0){
                dd.dims.zoomed = "noZoom";
            }
            else{
                dd.dims.zoomed = "out";
            }
          }
          return dd
        })
        let widthmap = dated.map(d=>d.dims.width)
        let withx = dated.map(function(d, i){
          d.dims.xval = widthmap.slice(0, i).reduce((a,b)=>a+b,0)
          return d
        })
        return withx;
    };

    // dynamically set width scale
    widthscale(total, selection, width){
      if(selection>total){
        throw "Selection is greater than total!"
      }else if (selection==0) {
        let w = width/total
        return [w,w]
      }
      try{
        let scalefactor = 0.50
        let prop = selection/total
        let newsel = prop+(1-prop)*scalefactor
        let newout = 1-newsel
        let selwidth = width*newsel/selection
        let outwidth = width*newout/(total-selection)
        console.log('total, selection, width', total, selection, width);
        // console.log('widths', selection, " / ", total, "__width", width, "__sel, out", selwidth, outwidth)

        return [selwidth, outwidth]
      }
      catch{
        console.error(e);
      }
    }

    // sets sorted label order
    setSortedLabels(){
        // get a valid year and month
        let year = Object.keys(this.data)[0];
        let month = Object.keys(this.data[year])[0];
        // nominal should be sorted by largest value
        this.sortedLabels["trigger"] = this.sortCategory("trigger");
        // ordinal should be in the right order already
        this.sortedLabels["aspect"] = Object.keys(this.data[year][month]["aspect"]);
        this.sortedLabels["width"] = Object.keys(this.data[year][month]["width"]);
        this.sortedLabels["elevation"] = Object.keys(this.data[year][month]["elevation"]);
    }

    // returns sorted list of category labels
    sortCategory(category){
        // get a valid year and month
        let startYear = Object.keys(this.data)[0];
        let startMonth = Object.keys(this.data[startYear])[0];
        let labels = Object.keys(this.data[startYear][startMonth][category]);
        // initialize dict for counts of labels
        let count_dict = {};
        for (let index = 0; index < labels.length; index++){
            count_dict[labels[index]] = 0;
        }
        // set counts of labels
        for (let year in this.data) {
            for (let month in this.data[year]) {
                for (let index = 0; index < labels.length; index++){
                    count_dict[labels[index]] = count_dict[labels[index]] + this.data[year][month][category][labels[index]];
                }
            }
        }
        //sort by counts of labels
        let sorted_labels = Object.keys(count_dict).sort(function(a, b) {
          return count_dict[b] - count_dict[a];
        })
        return sorted_labels;
    }

    // attribute drop down functionality
    drawDropDown(indicator) {
        let that = this;
        let dropDownWrapper = d3.select('#dropdown-wrapper');
        let dropData = [];
        //
        for (let index = 0; index < this.attributes.length; index++){
            dropData.push({
                indicator: this.attributes[index],
                indicator_name: this.attributes[index]
            });
        }
        // drop down data
        let drop = dropDownWrapper.select('#dropdown_a').select('.dropdown-content').select('select');
        let options = drop.selectAll('option')
            .data(dropData);
        options.exit().remove();
        let optionsEnter = options.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);
        optionsEnter.append('text')
            .attr("class", "dropdown_option")
            .text((d, i) => d.indicator_name.charAt(0).toUpperCase() + d.indicator_name.slice(1));
        options = optionsEnter.merge(options);

        let selected = options.filter(d => d.indicator === indicator)
            .attr('selected', true);

        drop.on('change', function(d, i) {
            let value = this.options[this.selectedIndex].value;
            that.updateAttribute(value);
            // unselect buttons
            let s = d3.select('#story').selectAll('.button').classed('is-info', false)
            d3.select('#story').select('#context').text('')
        });
    }

    checkBox(){
        let that = this;
        // summer check box
        d3.select("#summerCheckBox").on("change",update);
            update();
        function update(){
            if(d3.select("#summerCheckBox").property("checked")){
                that.showSummer = true;
                that.updatesummer(that.showSummer)
                that.updateHistogram();
                that.updateAreaChart();

            }
            else{
                that.showSummer = false;
                that.updatesummer(that.showSummer)
                that.updateHistogram();
                that.updateAreaChart();
            }
        }
    }


}
