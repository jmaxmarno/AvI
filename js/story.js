class story{
    constructor(data, category, updateTime) {
      // Data:
        this.data = data;
        this.category =  category;
        this.updateTime = updateTime;
      // styling parameters
        this.margin = {top: 10, bottom: 10, left: 10, right: 40};
        let divDim = d3.select("#story").node().getBoundingClientRect();
        this.width = divDim.width - this.margin.left - this.margin.right;
        this.height = divDim.height - this.margin.top - this.margin.bottom;

      //story data
        this.descriptions = {
          "trigger": ["- Slides can occur naturally or be triggered intentionally or unintentionaly by human activity.",
            "- It is important to remember that human triggered slides are more likely to be reported and these observations are not a representative sample of all avalanches in Utah."],
          "aspect": ["- Aspect is the direction the slope faces with respect to the sun.","-  North and East facing slopes recieve much less sunlight resulting in a colder snowpack with fragile weak-layers. These slopes alse tend to get more human traffic as the snow is deeper and better.", "- For these reasons the majority of avalanches occur on North and East facing slopes, this can be seen in the star plot."],
          "width": ["- Width refers to the distance across the hill of the slide.", "- Observations have recorded widths ranging from five to five thousand feet across.", "- The majority of slides reported are less than 200 feet across.", "- Avalanche size is typically measured by width, depth, and verticle distance. Width is noted in avalanche observations more consitently than depth and verticle distance, most likely because it is easier to estimate."],
          "elevation": ["- "]
          }

        this.icons = {
          "trigger":"https://img.icons8.com/material/48/000000/ski-simulator.png",
          "aspect":"https://img.icons8.com/ios-filled/50/000000/wind-rose.png",
          "width":"https://img.icons8.com/ios/50/000000/tape-measure-sewing.png",
          "elevation":"https://img.icons8.com/ios-filled/50/000000/ski-resort.png"
        }

        this.points = {
          "trigger":[
            {"display":"Feb. 2011",
              "time":[{"year":2011,"months":[2]}],
              "text":"Many skiers."
            },
            {"display":"February",
              "time":[{"year":2011,"months":[2]},{"year":2011,"months":[2]}],
              "text":"Test feb."
            },
            {"display":"2011",
              "time":[{"year":2011,"months":[1,2,3,4,5,6,7,8,9,10,11,12]}],
              "text":"Many skiers."
            }
          ],
          "aspect":[
            {"display":"May 2011","time":[],"text":"The distribution of the slope aspect in the observations of May 2011 looks quite different from most months. It appears that many more slides were reported on South and West facing slopes but it is hard to draw conclusions about this month because there were only five avalanche observations, making the proportions prone to effected by random chance."},
            {"display":"Nov. and Dec.","time":[],"text":"As the star plot distribution illustrates, in the early months of winter there are even fewer observations of slides on South and West facing slopes than there are in general. At this point in time, the sun has likely prevented much snow from accumulating on the warmer South and West facing slopes, making them less likely to slide."},
            {"display":"Winter 17/18","time":[],"text":"Looking at the 2017-2018 winter season, we can see the increase in South facing slide observations over time. In the beginning of the season, the reported avalanches are mostly north facing, as the snow pack is accumulating faster in these colder regions, but as snow depth increases over time, there are more South facing observations."}
          ],
          "width":[
            {"display":"Dec. 2011","time":[],"text":"In December 2011 there were relatively few avalanches reported (only 21 observations whereas on average there are around 70 reported in December). We can also see that the avalanches that were reported were relatively small, none of them were over 200 feet wide. Compare this to January 2012."},
            {"display":"Jan. 2012","time":[],"text":"In January 2012, we can see from the time grid and histogram the number of avalanche observations increased quickly - from 21 the previous month to 146.  We can also see the distribution of size shifts toward wider avalanches. This suggests a correlation between the number of avalanches being reported and the size of the observed avalanches."},
            {"display":"Winter 14/15","time":[],"text":"In the winter season of 2014-2015 there appears to be a trend in the proportion of observed widths. In the bar chart we can see that as time goes on there are the width of the reported slides decreases. This may be because the 2014-2015 season was warmer than most, resulting in less snow accumulation and smaller slides."}
          ],
          "elevation":[
            {"display":"Feb. 2011","time":[{"year":2011,"months":[2]}],"text":"Many skiers."},
            {"display":"February","time":[{"year":2011,"months":[2]},{"year":2011,"months":[2]}],"text":"Many skiers."},
            {"display":"2011","time":[{"year":2011,"months":[1,2,3,4,5,6,7,8,9,10,11,12]}],"text":"Many skiers."}
          ],
        }

        this.draw();
    }

    // update function (re-draw)
    update(activeatt, activetime){
        this.category = activeatt;
        this.draw();
    }

    draw(){
      let that = this;
      // update title
      d3.select("#catIcon").attr("src", this.icons[this.category]);
      d3.select("#attrTitle").text(this.category);
      // update description
      let ul = d3.select("#attrDescription").selectAll('li').data(this.descriptions[this.category]);
      let ul_enter = ul.enter().append('li');
      ul.exit().remove();
      ul = ul_enter.merge(ul)
      ul.html(String);
      let data = this.points[this.category]
      // update buttons 
      let buttons = d3.select("#story").selectAll("a").data(data);
      let buttons_enter = buttons.enter().append("a");
      buttons.exit().remove();
      buttons = buttons_enter.merge(buttons);
      buttons.text((d)=> d.display)
        .on("click", function(d){
          // that.updateTime(d.time); //not working
          d3.selectAll(".button").classed("is-info", false);
          d3.select(this).classed("is-info", true);
          d3.select("#context").text(d.text);
          console.log("2")
        })
      d3.select("#yearbox").on("click", function(d){
        d3.selectAll(".button").classed("is-info", false);
        d3.select("#context").text("");
        console.log(this)
      });
    }

}
    