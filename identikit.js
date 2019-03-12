(function(window){
    'use strict'
    function init(){
      var identikit = {};
      identikit.tickF = function(d, i) {
        		if (d.getMonth() == 0) {
        			return d.getFullYear();
        		} else {
        			return months[d.getMonth()];
        		}
        }
      identikit.render_simple_chart = function(container, data){ // container : div object to house chart, data: formatted dateset (watchtower form)
          // default sizes to fit to div
          var newc = $(container);

          var sizes = {height: newc.height(), width: newc.width()};

          var dP = d3.timeParse("%s");


          data = data.map(function(d) {
        			return {
        				date: dP(d.timestamp),
        				open: +d.indicators.open,
        				high: +d.indicators.high,
        				low: +d.indicators.low,
        				close: +d.indicators.close,
        				volume: +d.indicators.volume
        			};
            })

            data = data.slice(data.length - 200, data.length)

          // defaultidentikit margins
          var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = sizes.width - margin.left - margin.right,
            height = sizes.height - margin.top - margin.bottom;

          var parseTime = d3.timeParse("%d-%b-%y");

          var x = techan.scale.financetime().range([0, width]).outerPadding(0); // oh yea i forgot to mention we use techan as a dependency lmao
          var y = d3.scaleLinear().range([height, 0]);

          var xAxis = d3.axisBottom(x).ticks(1).tickFormat(identikit.tickF).tickSizeOuter(0).tickSizeInner(0);
          var yAxis = d3.axisLeft(y).ticks(0).tickSizeOuter(0).tickSizeInner(0); // probably remove this

          var close = techan.plot.close()
            .xScale(x)
            .yScale(y);

          var svg = d3.select(container) // this probs isn't right
            .append("svg")
            .attr("width", width + margin.left + margin.right)
          	.attr("height", height + margin.top + margin.bottom)
          	.append("g")
          	.attr("transform", "translate(" + margin.left + " ," + margin.top + " )");

          x.domain(data.map(close.accessor().d));
          y.domain(techan.scale.plot.ohlc(data, close.accessor()).domain());

          svg.append("path")
            .attr("class", "area")
            .attr("fill-opacity", 0.025);

          svg.append("g")
            .attr("class", "close");

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .attr("stroke-width", "2px");

          svg.append("g")
          	.attr("class", "y axis")
          	.attr("stroke-width", "3px")
          	.append("text")
          	.attr("y", 6)
          	.attr("dy", ".71em")

          var area = d3.area()
            .x(function(d) {
            	return x(d.date);
            })
            .y0(height + 1)
            .y1(function(d) {
            	return y(d.close);
            });
          svg.selectAll("path.area")
            .datum(data)
            .attr("d", area);
          svg.selectAll("g.close")
            .datum(data)
            .call(close);
          svg.selectAll("g.x.axis")
            .call(xAxis);
          svg.selectAll("g.y.axis")
            .call(yAxis);
          }

      return identikit;
    }
    if(typeof(identikit) === 'undefined'){
        window.identikit = init();
    }
})(window);
