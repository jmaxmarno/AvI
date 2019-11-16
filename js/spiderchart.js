class spiderchart{
    /**
     * Creates a Bubble plot Object
     */
    constructor(data, histData, category, activeTime) {
      // Chart styling parameters
      console.log(category);
        this.width = 200;
        this.height = 200;
        this.margin = {top: 40, bottom: 40, left: 50, right: 50};
        this.innerlevels = 4;
        this.max = 1;
        this.color = d3.scaleOrdinal(d3.schemeCategory10);
      // Chart Data:
        this.data = data;
        this.histData = histData;
        this.category =  category;
        this.activeTime = activeTime;

        let startYear = Object.keys(this.data)[0];
        let startMonth = Object.keys(this.data[startYear])[0];
        this.labels = Object.keys(this.data[startYear][startMonth][this.category]);
        this.draw();

    };

    draw(){
      let self = this;
      let axes = self.labels;
      let axesLength = axes.length;
      let axesRadius = self.height / 2
      let axesSlice = Math.PI * 2 / axesLength
      // radius scale
      let radiusScale = d3.scaleLinear()
      .range([0, axesRadius])
      .domain([0, self.max])
      console.log(axes)

      // svg stuff
      d3.select('#spidersvg').remove();
      let spidersvg = d3.select('#starplot').append('svg').attr('id', 'spidersvg')
        .attr('width', self.width+self.margin.left+self.margin.right)
        .attr('height', self.height+self.margin.bottom+self.margin.top);
      let spider_g = spidersvg.append('g')
        .attr('transform', 'translate(' + (self.width/2 + self.margin.left) + ',' + (self.height/2 + self.margin.top) + ')');
        // Wrapper for axes
      let axesWrap = spider_g.append('g')
      // draw inner circles
      axesWrap.selectAll('.levels')
      .data(d3.range(1, (this.innerlevels+1)).reverse())
      .enter().append('circle')
      .attr('r', function(d, i){
        return axesRadius/self.innerlevels*d;
      })
      .style('fill', 'gray')
      .style('stroke', 'black')
      .style('fill-opacity', '0.2')
      // draw axes lines
      let axesLines = axesWrap.selectAll('.axis')
      .data(self.labels).enter().append('g')
      .attr('class', 'axis');
      axesLines.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', function(d, i){
        return radiusScale(self.max)*Math.cos(axesSlice*i - Math.PI/2);
      })
      .attr('y2', function(d, i){
        return radiusScale(self.max)*Math.sin(axesSlice*i - Math.PI/2);
      })
      .attr('class', 'spideraxis')
      .style('stroke', 'white')
      .style('stroke-width', '2px')
      .style('stroke-opacity', '0.4')

      // Axis Labels:
      axesLines.append('text')
      .text(d=>d)
      .style("font-size", "10px")
      // .attr('class', 'spideraxis')
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr('x', function(d, i){
        return radiusScale(self.max*1.3)*Math.cos(axesSlice*i - Math.PI/2);
      })
      .attr('y', function(d, i){
        return radiusScale(self.max*1.3)*Math.sin(axesSlice*i - Math.PI/2);
      })


    }

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
        let summer = [];
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
                        summer.push(dict.date)
                    }
                }
                else{
                    areaData.push(dict);
                }
            }
        }
        console.log('areaData',areaData)
        let total = areaData.length
        // Scale widths based on 'in' or 'out' of selected date range
        let widths = this.widthscale(total, activemonthscount, this.area.width)
        // Calculate rect dimensions based on date range selection:
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
        console.log(summer);
        let final = [];
        for (let index = 0; index < withx.length; index ++) {
            let dict = withx[index]
            console.log(dict)
            if (summer.indexOf(dict.date) < 0){
                final.push(dict);
            }
        }
        return final;
        console.log(final)
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
        console.log('widths', selection, " / ", total, "__width", width, "__sel, out", selwidth, outwidth)
        return [selwidth, outwidth]
      }
      catch{
        console.error(e);
      }
    }

// Adapted from:
// http://bl.ocks.org/nbremer/raw/21746a9668ffdf6d8242/

}
