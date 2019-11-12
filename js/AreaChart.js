class AreaChart{
    /**
     * Creates a Bubble plot Object
     */
    constructor(data, histData, activeAttribute, activeTime, updateAttribute, updateTime) {
        this.data = data;
        this.histData = histData
        this.activeAttribute = activeAttribute;
        this.activeTime = activeTime;
        this.updateAttribute = updateAttribute;
        // this.updateTime = updateTime;

        this.showSummer = true;

        this.hist = {
            'width':  1200,
            'height' : 100,
            'buffer' : 30
        };
        this.area = {
            'width': 1200,
            'height': 300,
            'buffer': 30
        }

        this.attributes = ["trigger", "aspect", "size", "elevation"];
        this.sortedLabels = {};
        this.setSortedLabels();

        this.createHistogram();
        this.createAreaChart();
        this.drawDropDown();
        this.checkBox();
    };

    // sets sorted label order
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

    // draws histogram of all data
    createHistogram(){
        let axisBuffer = 30;
        let data = this.histData
        if (!this.showSummer){
            let newData = [];
            for (let index = 0; index < data.length; index ++){
                if (data[index]["count"] > 0){
                    newData.push(data[index]);
                }
            }
            data = newData;
        }
        let that = this;
        // scale
        let xHistScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, this.hist.width]);
        let maxCount = d3.max(this.histData, (d) => d.count);
        let yHistScale = d3.scaleLinear()
            .domain([0,maxCount])
            .range([0, this.hist.height-10]);
        let yAxisScale = d3.scaleLinear()
            .domain([maxCount,0])
            .range([10, this.hist.height]);
        // svg
         let svg = d3.select('#histogram').append('svg')
            .attr("width", this.hist.width+(2*this.hist.buffer))
            .attr("height", this.hist.height+(2*this.hist.buffer));
        // axis
        let yAxis = d3.axisLeft();
        yAxis.scale(yAxisScale)
            .ticks(3);
        svg.append("g")
            .attr("id","yHistAxis")
            .attr("transform", "translate("+this.hist.buffer+","+ this.hist.buffer+")") 
            .call(yAxis);
        d3.select("g#yHistAxis").select("path").remove(); // remove top tick
        // add plot
        let plot = svg.append("g").attr("transform", "translate("+this.hist.buffer+","+this.hist.buffer+")").attr("id", "histPlot");
        // border
        plot.append("rect")
            .attr("width", this.hist.width)
            .attr("height", this.hist.height)
            .attr("class", "border")
        // histogram bars
        let barWidth = this.hist.width/data.length;
        let bar = plot.selectAll("g")
            .data(data)
            .enter().append("g");
        bar.append("line")
            .attr('x1', (d,i) => xHistScale(i))
            .attr('x2', (d,i) => xHistScale(i))
            .attr('y1', 0)
            .attr('y2', function(d){
                if (d.month == 1){ return that.hist.height }
                else{ return 0}
            })
            .attr("class", "yearLine");
        bar.append("rect")
            .attr('x', (d,i) => xHistScale(i))
            .attr('y', (d) => this.hist.height - yHistScale(d.count))
            .attr('width',barWidth)
            .attr('height', (d) => yHistScale(d.count));
        bar.append("text")
            .attr('x', (d,i) => xHistScale(i))
            .attr('y', -this.hist.buffer/2)
            .text(function(d){
                if (that.showSummer && d.month == 5){ return d.year }
                if (!that.showSummer && d.month == 3){ return d.year }
                else{return ""}
            })
            .attr("class", "yearLabel");   

    }

    updateHistogram(){
        let that = this;
        let data = this.histData;
        if (!this.showSummer){
            let newData = [];
            for (let index = 0; index < data.length; index ++){
                if (data[index]["count"] > 0){
                    newData.push(data[index]);
                }
            }
            data = newData;
        }
        let xHistScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, this.hist.width]);
        let maxCount = d3.max(this.histData, (d) => d.count);
        let yHistScale = d3.scaleLinear()
            .domain([0,maxCount])
            .range([0, this.hist.height-10]);
        let barWidth = this.hist.width/data.length;
        let barGroups = d3.select("#histPlot").selectAll("g").data(data);
        let barEnter = barGroups.enter().append("g");
        barEnter.append("line");
        barEnter.append("rect");
        barEnter.append("text");
        barGroups.exit().remove();
        barGroups.select("line")
            .transition()
            .duration(500)
            .attr('x1', (d,i) => xHistScale(i))
            .attr('x2', (d,i) => xHistScale(i))
            .attr('y1', 0)
            .attr('y2', function(d){
                if (d.month == 1){ return that.hist.height }
                else{ return 0}
            })
            .attr("class", "yearLine");
        barGroups.select("rect")
            .transition()
            .duration(500)
            .attr('x', (d,i) => xHistScale(i))
            .attr('y', (d) => this.hist.height - yHistScale(d.count))
            .attr('width',barWidth)
            .attr('height', (d) => yHistScale(d.count));
        barGroups.select("text")
            .transition()
            .duration(500)
            .attr('x', (d,i) => xHistScale(i))
            .attr('y', -this.hist.buffer/2)
            .text(function(d){
                if (that.showSummer && d.month == 5){ return d.year }
                if (!that.showSummer && d.month == 3){ return d.year }
                else{return ""}
            })
            .attr("class", "yearLabel"); 
       
        barGroups = barEnter.merge(barGroups);
    }

    setAttribute(attribute){
        this.activeAttribute = attribute;
        this.updateAreaChart();
    }

    setTime(activeTime){
        this.activeTime = activeTime;
        this.updateAreaChart();

    }

    // Creates area chart layout
    createAreaChart(){
        // svg
        let areaSVG = d3.select('#areachart').append('svg')
            .attr("width", this.area.width + (2*this.area.buffer))
            .attr("height", this.area.height + (2*this.area.buffer));
        //plot
        let plot = areaSVG.append("g").attr("transform", "translate("+this.area.buffer+","+this.area.buffer+")").attr("id", "areaPlot");
        //border
        plot.append("rect")
            .attr("width", this.area.width)
            .attr("height", this.area.height)
            .attr("class", "border");
        //define series
        let areaData = this.getAreaData();
        let columns = Object.keys(areaData[0]);
        let series = d3.stack().keys(columns.slice(2))(areaData); // don't include date
        // bar scales
        let xBarScale = d3.scaleLinear()
            .domain([0, areaData.length])
            .range([0, this.area.width]);
        let yBarScale = d3.scaleLinear()
            .domain([0,1])
            .range([this.area.height,0]);
        let color = d3.scaleOrdinal(d3.schemeCategory10);
        // add bars
        let rectWidth = this.area.width/areaData.length;
        let catGroups = plot.selectAll("g").data(series).enter()
            .append("g")
            .style("fill", d => color(d.key));
        catGroups.selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", (d, i) => xBarScale(i))
            .attr("y", d=> yBarScale(d[1]))
            .attr("height",d=> yBarScale(d[0]) - yBarScale(d[1]))
            .attr("width", rectWidth)
            .on('click', function(d, i) {
                console.log(d);
            });
        // set up for drop down
        let dropdownWrap = d3.select('#dropdown').append('div').classed('dropdown-wrapper', true);
        let aWrap = dropdownWrap.append('div').classed('dropdown-panel', true);
        aWrap.append('div').classed('d-label', true)
            .append('text')
            .text('Attirbute');
        aWrap.append('div').attr('id', 'dropdown_a').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');
        
    }

    // updates area chart with given attribute data
    updateAreaChart(){
      console.log('Update Area Chart')
        let plot = d3.select("#areaPlot")
        //define series
        let areaData = this.getAreaData();
        let columns = Object.keys(areaData[0]);
        // console.log('columns', columns.slice(2))
        let series = d3.stack().keys(columns.slice(2))(areaData); // don't include date or dimensions
        // console.log('series', series)
        // bar scales
        let xBarScale = d3.scaleLinear()
            .domain([0, areaData.length])
            .range([0, this.area.width]);
        let yBarScale = d3.scaleLinear()
            .domain([0,1])
            .range([this.area.height,0]);
        let color = d3.scaleOrdinal(d3.schemeCategory10);
        // add bars
        let rectWidth = this.area.width/areaData.length;
        // console.log(rectWidth)
        let catGroups = plot.selectAll("g").data(series);
        let catEnter = catGroups.enter().append("g").style("fill", d => color(d.key));
        catGroups.exit().remove();
        catGroups = catEnter.merge(catGroups);
        let catRects = catGroups.selectAll("rect").data(d => d);
        let catRectsEnter = catRects.enter().append("rect")
            // .attr("x", (d, i) => xBarScale(i))
            .attr("x", d=>d.data.dims.xval)
            // .attr("width", rectWidth)
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
            // .attr("width", rectWidth)
            .attr("width", d=>d.data.dims.width)
            .attr("y", d=> yBarScale(d[1]))
            .attr("height",d=> yBarScale(d[0]) - yBarScale(d[1]))
            .style("opacity", 1);
    }

    // gets area chart data with specified category
    getAreaData(){
        let that = this;
        let areaData = [];
        let labels = this.sortedLabels[this.activeAttribute];
        let activemonthscount = 0;
        let activeyears = [];
        // Date range stuff
        if(this.activeTime.length){
          console.log('activetime', this.activeTime)
          activeyears = this.activeTime.map(d=>d.year)
          activemonthscount = this.activeTime.map(d=>d.months.length).reduce((a,b)=> a+b, 0)
          console.log('selectedyears', activeyears, activemonthscount)
        }

        for (let year in this.data) {
            for (let month in this.data[year]) {
                let date = month +'/'+ year;
                let dict = {'date': date};
                dict.dims = {};
                let count = this.data[year][month]["total_count"];
                let allZeros = true;
                for (let index = 0; index < labels.length; index++){
                    let label = labels[index];
                    let proportion;
                    if (count != 0){
                        proportion = this.data[year][month][this.activeAttribute][label] / count;
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
        console.log('areaData',areaData)
        let total = areaData.length
        let widths = this.widthscale(total, activemonthscount, this.area.width)

        let dated = areaData.map(function(dd, i){
          let ddate = dd.date.split("/")
          let mmonth = ddate[0]
          let yyear = ddate[1]
          if(activeyears.includes(yyear)){
            let selmonths = that.activeTime.filter(d=>d.year==yyear)[0].months
            if(selmonths.includes(parseInt(mmonth))){
              dd.dims.width = widths[0]
            }else{
              dd.dims.width = widths[1]
            }
          }else{
            dd.dims.width = widths[1]
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
        console.log('widths', selection, " / ", total, "__width", width, "__sel, out", selwidth, outwidth)
        return [selwidth, outwidth]
      }
      catch{
        console.error(e);
      }
    }
    // updaterectwidth(dateselection){
    //   let that=this;
    //   if(dateselection.length>0){
    //     console.log('datesel',dateselection.length, dateselection)
    //     let selyears = dateselection.map(d=>d.year)
    //     let allbars = d3.select('#areaSVG').selectAll('rect').filter(d=>d)
    //     let bbars=allbars.filter(function(d){
    //       if (d){
    //         let ddate = d.data.date.split("/")
    //         let mmonth = ddate[0]
    //         let yyear = ddate[1]
    //         if(selyears.includes(yyear)){
    //           let selmonths = dateselection.filter(d=>d.year==yyear).map(d=>d.month);
    //           if(selmonths.includes(mmonth)){
    //             return d
    //           }
    //         }
    //       }
    //   })
    //
    //   let totalbars = []
    //   allbars.each(function(d, i){
    //     let xx = d3.select(this).attr("x")
    //     if(totalbars.includes(xx)){
    //       // console.log(xx, 'alreaady in there')
    //     }else{
    //       totalbars.push(xx)
    //     }
    //   })
    //
    //   let selbars = []
    //   bbars.each(function(d, i){
    //     let xx = d3.select(this).attr("x")
    //     if(selbars.includes(xx)){
    //       // console.log(xx, 'alreaady in there')
    //     }else{
    //       selbars.push(xx)
    //     }
    //   })
    //   // let selectedbars = Object.keys(bbars.data()).length
    //   let newwidths = this.widthscale(totalbars.length, selbars.length, this.area.width)
    //
    //     allbars.attr('width', newwidths[1])
    //     bbars.attr('width', newwidths[0])
    //
    //   // console.log('totalbars', totalbars)
    //   // console.log('selected bars', selbars)
    //
    //   function xval(inx){
    //     let xcount = totalbars.filter(d=> d<inx).map(function(d){
    //       // console.log('xbarval', d)
    //       //   console.log('d less than inx')
    //         if(selbars.includes(String(d))){
    //           // console.log('d IS in selbars')
    //           return newwidths[0]
    //         }else{
    //           // console.log('d not in selbars')
    //           return newwidths[1]
    //         }
    //     })
    //     return xcount.reduce((a,b)=> a+b, 0)
    //   }
    //   // allbars.each(function(d, i){
    //   //   let currx = d3.select(this).attr("x")
    //   //   d3.select(this).attr("x", d=>xval(currx))
    //   // })
    //   console.log('xval:200', xval(200))
    //
    //
    //   }else{
    //     let allbars = d3.select('#areaSVG').selectAll('rect').filter(d=>d)
    //     let totalbars = []
    //     allbars.each(function(d, i){
    //       let xx = d3.select(this).attr("x")
    //       if(totalbars.includes(xx)){
    //         // console.log(xx, 'alreaady in there')
    //       }else{
    //         totalbars.push(xx)
    //       }
    //     })
    //     let rectWidth = that.area.width/totalbars.length
    //     allbars.attr('width', rectWidth)
    //     allbars.attr('x', function(d,i){
    //       return i*that.area.width/totalbars.length
    //     })
    //   }
    // }

    drawDropDown(indicator) {
        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper');
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
            .text((d, i) => d.indicator_name);
        options = optionsEnter.merge(options);

        let selected = options.filter(d => d.indicator === indicator)
            .attr('selected', true);

        drop.on('change', function(d, i) {
            let value = this.options[this.selectedIndex].value;
            that.updateAttribute(value);
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
                that.updateHistogram(); 
                that.updateAreaChart();        
            }
            else{
                that.showSummer = false;
                that.updateHistogram();
                that.updateAreaChart();
            }
        }
    }


}
