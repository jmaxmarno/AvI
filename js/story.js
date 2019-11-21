class story{
    constructor(data, category) {
      // styling parameters
        this.margin = {top: 10, bottom: 10, left: 10, right: 40};
        let divDim = d3.select("#story").node().getBoundingClientRect();
        this.width = divDim.width - this.margin.left - this.margin.right;
        console.log(divDim.width)
        this.height = divDim.height/2 - this.margin.top - this.margin.bottom;
      // Data:
        this.data = data;
        this.category =  category;
        this.activetime = [];

        let startYear = Object.keys(this.data)[0];
        let startMonth = Object.keys(this.data[startYear])[0];
        this.labels = Object.keys(this.data[startYear][startMonth][this.category]);
        this.draw();
    }

    draw(){
      let self = this;
      d3.select('#storyGroup').remove();
      d3.select('#storySVG').remove();
      let storysvg = d3.select('#story').append('svg').attr('id', 'storySVG')
        .attr("x", self.margin.left)
        .attr("y", self.margin.right)
        .attr('width', self.width)
        .attr('height', self.height);
      let story_g = storysvg.append('g').attr("id", "storyGroup")
        .attr('transform', 'translate(' +  self.margin.left + ',' + 2*self.margin.top + ')');
      if(this.category == "trigger"){ this.drawTrigger(); }
      if(this.category == "aspect"){ this.drawAspect(); } 
      if(this.category == "size"){ this.drawSize(); } 
      if(this.category == "elevation"){ this.drawElevation(); } 
    }

      // update function (re-draw)
    update(activeatt, activetime){
      this.activetime = activetime;
      this.category = activeatt;
      let startYear = Object.keys(this.data)[0];
      let startMonth = Object.keys(this.data[startYear])[0];
      this.labels = Object.keys(this.data[startYear][startMonth][this.category]);
      this.draw();
    }

    drawTrigger(){
      let storyG = d3.select("#storyGroup")
      storyG.append("text")
        .attr("class", "storyText")
        .text("Slides can occur naturally, be triggered intentionally by humans, or be trigger unintentionally by humans.");
    }

    drawAspect(){
      let storyG = d3.select("#storyGroup")
      storyG.append("text").text("Aspect");
    }

    drawSize(){
      let storyG = d3.select("#storyGroup")
      storyG.append("text").text("Size");
    }

    drawElevation(){
      let storyG = d3.select("#storyGroup")
      storyG.append("text").text("Elevation");
    }
}
    