class story{
    constructor(data, category, yearGrid) {
      // Data:
        this.data = data;
        this.category =  category;
        this.yearGrid = yearGrid;
      // styling parameters
        this.margin = {top: 10, bottom: 10, left: 10, right: 40};
        let divDim = d3.select("#story").node().getBoundingClientRect();
        this.width = divDim.width - this.margin.left - this.margin.right;
        this.height = divDim.height - this.margin.top - this.margin.bottom;

      //story data
        this.descriptions = {
          "trigger": ["- Slides can occur naturally or be triggered by human activity (intentionally or unintentionaly).",
            "- It is important to remember that this data is comprised of submitted avalanche reports.",
            " Thus, avalanches triggered by or near observers are more likely to be reported and these observations are not a representative sample of all avalanches in Utah."],
          "aspect": ["- Aspect is the direction the slope faces with respect to the sun.","-  North and East facing slopes recieve much less sunlight resulting in a colder snowpack with fragile weak-layers. These slopes alse tend to get more human traffic as the snow is deeper and better.", "- For these reasons the majority of avalanches occur on North and East facing slopes, this can be seen in the star plot."],
          "width": ["- Width refers to the distance across the hill of the slide.", "- Observations have recorded widths ranging from five to five thousand feet across.", "- The majority of slides reported are less than 200 feet across.", "- Avalanche size is typically measured by width, depth, and verticle distance. Width is noted in avalanche observations more consitently than depth and verticle distance, most likely because it is easier to estimate."],
          "elevation": ["- Avalanche danger can change dramatically with elevation. This is evidenced by the fact that avalanche danger ratings will vary across elevation bands even for the same day. The elevation bands used here are the same that are used by many avalanche forcasting organizations including the UAC."]
          }

        this.icons = {
          "trigger":"https://img.icons8.com/material/48/000000/ski-simulator.png",
          "aspect":"https://img.icons8.com/ios-filled/50/000000/wind-rose.png",
          "width":"https://img.icons8.com/ios/50/000000/tape-measure-sewing.png",
          "elevation":"https://img.icons8.com/ios-filled/50/000000/ski-resort.png"
        }

        this.points = {
          "trigger":[
            {"display":"February 2015",
              "time":[{"year":'2015',"months":[2]}],
              "text":"Snowmobiler trigger avalanches were up 15% this month (8% to 23%) as shown in the central radar chart.  It's tough to speculate as to what could have caused this shift, but given the low proportion of natural avalanches reported this points at low snowfall."
            },
            {"display":"All Novembers",
              "time":[{"year":'2009',"months":[11]}
              ,{"year":'2010',"months":[11]}
              ,{"year":'2011',"months":[11]}
              ,{"year":'2012',"months":[11]}
              ,{"year":'2013',"months":[11]}
              ,{"year":'2014',"months":[11]}
              ,{"year":'2015',"months":[11]}
              ,{"year":'2016',"months":[11]}
              ,{"year":'2017',"months":[11]}
              ,{"year":'2018',"months":[11]}
              ,{"year":'2019',"months":[11]}],
              "text":"Early season can be dangerous. Note the increase in the proportion of skier-triggered reports for all Novembers. However, the timeline seems to show a trend indicating an increase in natural-triggered slides reported, and decrease in skier-triggered slides reported. (Compare the enlarged green blocks moving left to right)"
            },
            {"display":"Winter 2013/2014",
              "time":[{"year":"2013", "months":[8,9, 10, 11, 12]}, {"year":"2014", "months":[1,2,3,4,5,6,7]}],
              "text": "This season we see a deviation from the running norm - an increase in the proportion of naturally triggered avalanches reported."}
          ],
          "aspect":[
            {"display":"May 2011","time":[{"year":"2011","months":[5]}],"text":"The distribution of the slope aspect in the observations of May 2011 looks quite different from most months. It appears that many more slides were reported on South and West facing slopes but it is hard to draw conclusions about this month because there were only five avalanche observations, making the proportions prone to effected by random chance."},
            {"display":"Nov. and Dec.","time":[{"year":"2009","months":[11,12]},{"year":"2010","months":[11,12]},{"year":"2011","months":[11,12]},{"year":"2012","months":[11,12]},{"year":"2013","months":[11,12]},{"year":"2014","months":[11,12]},{"year":"2015","months":[11,12]},{"year":"2015","months":[11,12]},{"year":"2016","months":[11,12]},{"year":"2017","months":[11,12]},{"year":"2018","months":[11,12]}],"text":"As the star plot distribution illustrates, in the early months of winter there are even fewer observations of slides on South and West facing slopes than there are in general. At this point in time, the sun has likely prevented much snow from accumulating on the warmer South and West facing slopes, making them less likely to slide."},
            {"display":"Winter 17/18","time":[{"year":"2017","months":[8,9,10,11,12]},{"year":"2018","months":[1,2,3,4,4,5,6,7]}],"text":"Looking at the 2017-2018 winter season, we can see the increase in South facing slide observations over time. In the beginning of the season, the reported avalanches are mostly north facing, as the snow pack is accumulating faster in these colder regions, but as snow depth increases over time, there are more South facing observations."}
          ],
          "width":[
            {"display":"Dec. 2011","time":[{"year":"2011","months":[12]}],"text":"In December 2011 there were relatively few avalanches reported (only 21 observations whereas on average there are around 70 reported in December). We can also see that the avalanches that were reported were relatively small, none of them were over 200 feet wide. Compare this to January 2012."},
            {"display":"Jan. 2012","time":[{"year":"2012","months":[1]}],"text":"In January 2012, we can see from the time grid and histogram the number of avalanche observations increased quickly - from 21 the previous month to 146.  We can also see the distribution of size shifts toward wider avalanches. This suggests a correlation between the number of avalanches being reported and the size of the observed avalanches."},
            {"display":"Winter 14/15","time":[{"year":"2014","months":[8,9,10,11,12]},{"year":"2015","months":[1,2,3,4,4,5,6,7]}],"text":"In the winter season of 2014-2015 there appears to be a trend in the proportion of observed widths. In the bar chart we can see that as time goes on there are the width of the reported slides decreases. This may be because the 2014-2015 season was warmer than most, resulting in less snow accumulation and smaller slides."}
          ],
          "elevation":[
            {"display":"October 2019","time":[{"year":"2019","months":[10]}],"text":"No surprise here - all reported avalanches were above 9,500 feet for October 2019."},
            {"display":"All Januarys","time":[{"year":"2010","months":[1]}
            ,{"year":"2011","months":[1]}
            ,{"year":"2012","months":[1]}
            ,{"year":"2013","months":[1]}
            ,{"year":"2014","months":[1]}
            ,{"year":"2015","months":[1]}
            ,{"year":"2016","months":[1]}
            ,{"year":"2017","months":[1]}
            ,{"year":"2018","months":[1]}
            ,{"year":"2019","months":[1]}]
            ,"text":"January is one of the only times of year when we see a relative increase in lower elevation avalanches. "},
            {"display":"Winter 2014/2015","time":[{"year":'2014',"months":[8,9,10,11,12]}, {"year":"2015", "months":[1,2,3,4,5,6,7]}],"text":"This year saw our shallowest snowpack on record. During this season, Alta Guard received a measely 267.5 inches.  As one might expect there were more avalanches reported above 9,500 feet than normal (51% to 63%). Probably because there wasn't anything capable of sliding down low!"}
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
          that.yearGrid.selectgrid(d.time)
          d3.selectAll(".button").classed("is-info", false);
          d3.select(this).classed("is-info", true);
          d3.select("#context").text(d.text);
          // console.log("2")
        })
      d3.select("#yearbox").on("click", function(d){
        d3.selectAll(".button").classed("is-info", false);
        d3.select("#context").text("");
        // console.log(this)
      });
    }

}
