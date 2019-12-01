

# AvI - Avalanche Investigator
## Exploring Characteristics Utah's Reported Avalanches Over Time

Project Site: 

Repository: [https://github.com/jmaxmarno/avy-obs](https://github.com/jmaxmarno/avy-obs)

Screencast: [https://vimeo.com/376592967](https://vimeo.com/376592967)

Process Book: [https://github.com/jmaxmarno/avy-obs/blob/master/content/Process%20Book.pdf](https://github.com/jmaxmarno/avy-obs/blob/master/content/Process%20Book.pdf)

Data Source: [https://utahavalanchecenter.org/](https://utahavalanchecenter.org/)

Icons Source: [https://icons8.com/icons](https://icons8.com/icons)

Team members:


<table>
  <tr>
   <td>Jadie Adams
   </td>
   <td>Max Marno
   </td>
  </tr>
  <tr>
   <td>u0930409
   </td>
   <td>u0656379
   </td>
  </tr>
  <tr>
   <td><a href="mailto:jadieraeadams@gmail.com">jadieraeadams@gmail.com</a>
<p>
<a href="mailto:u0930409@utah.edu">u0930409@utah.edu</a>
   </td>
   <td><a href="mailto:jmaxmarno@gmail.com">jmaxmarno@gmail.com</a>
<p>
<a href="mailto:u0656379@utah.edu">u0656379@utah.edu</a>
   </td>
  </tr>
</table>


## Code Overview

### Data
* The data is dowloaded as a ".csv" file from [https://utahavalanchecenter.org/avalanches](https://utahavalanchecenter.org/avalanches) and named "avalanches.csv" such as this: [https://github.com/jmaxmarno/avy-obs/blob/master/data/avalanches.csv](https://github.com/jmaxmarno/avy-obs/blob/master/data/avalanches.csv)
* This is then turned into a ".json" file format by running "csv2json.py" at [https://github.com/jmaxmarno/avy-obs/blob/master/data/csv2json.py](https://github.com/jmaxmarno/avy-obs/blob/master/data/csv2json.py). This python script expects the ".csv" file to be in the "data" folder with the name "avalanches.cvs".
* The output from "csv2json.py" is saved as "avalanches.json" at [https://github.com/jmaxmarno/avy-obs/blob/master/data/avalanches.json](https://github.com/jmaxmarno/avy-obs/blob/master/data/avalanches.json). This is the file used by "script.js" in the JavaScript code for data binding.

### HTML

* The HTML code is "index.html" at [https://github.com/jmaxmarno/avy-obs/blob/master/index.html](https://github.com/jmaxmarno/avy-obs/blob/master/index.html)
* The styling is done via "styles.css" at [https://github.com/jmaxmarno/avy-obs/blob/master/styles.css](https://github.com/jmaxmarno/avy-obs/blob/master/styles.css)

### JavaScript
* The main JavaScript file is "script,js" at [https://github.com/jmaxmarno/avy-obs/blob/master/js/script.js](https://github.com/jmaxmarno/avy-obs/blob/master/js/script.js). This file calls all of the other JavaScript files to create the visualization elements. It is also used to update and maintain the selected time frame and characteristic.
* The main plot consisting of the histogram and stacked bar plot is created in "AreaChart.js" at [https://github.com/jmaxmarno/avy-obs/blob/master/js/AreaChart.js](https://github.com/jmaxmarno/avy-obs/blob/master/js/AreaChart.js). This code creates the plots and updates them on mouseover or when a new time frame or characteristic of interest is selected.
* The brushable time grid is created in "yeargrid.js" at [https://github.com/jmaxmarno/avy-obs/blob/master/js/yeargrid.js](https://github.com/jmaxmarno/avy-obs/blob/master/js/yeargrid.js). 
* The star plot or spider chart is created by "spiderchart.js" at [https://github.com/jmaxmarno/avy-obs/blob/master/js/spiderchart.js](https://github.com/jmaxmarno/avy-obs/blob/master/js/spiderchart.js) and updates when the selected characterisitc is changed.
* The story box is updated in "story.js" at [https://github.com/jmaxmarno/avy-obs/blob/master/js/story.js](https://github.com/jmaxmarno/avy-obs/blob/master/js/story.js).



