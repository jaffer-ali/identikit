(function(window){ // efficiency creeps
    'use strict'
    function init(){
      var identikit = {};
      identikit.monthTickF = function(d, i) {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        		if (d.getMonth() == 0) {
        			return d.getFullYear();
        		} else {
        			return months[d.getMonth()];
        		}
        }
      identikit.dayTickF = function(d, i) {
        	if (d.getMonth() == 0) {
          	return d.getFullYear();
          } else {
          	return months[d.getMonth()];
          }
      }
      identikit.completeXDate = function(range, date) {
        let endDate = new Date()
        switch(range){
          case "1d":
            endDate.setHours(16)
            endDate.setMinutes(0)
            endDate.setSeconds(0)
            break;
          case "1m":
            endDate.setSeconds(0)
            endDate.setMinutes(0)
            endDate.setHours(16)
            endDate.setMonth(endDate.getMonth() + 1)
            endDate.setDate(-1) // the day before the first day of the next month because javascript is dumb
            break;
          case "1y":
            endDate.setHours(16)
            endDate.setMinutes(0)
            endDate.setSeconds(0)
            endDate.setFullYear(endDate.getFullYear() + 1)
            endDate.setMonth(0)
            endDate.setDate(-1)
            break;

        }

        let rest = Math.round((endDate.getTime() - date[date.length - 1].getTime())/1000/60)
        let begDate = date[date.length - 1]

        for(let i = 0; i <= rest; i++){
          date.push(new Date(begDate.getTime() + i * 60 * 1000))
        }

        return date;
      }
      identikit.render_simple_chart = function(container, data){ // container : div object to house chart, data: formatted dateset (watchtower form)
          // default sizes to fit to div
          var newc = $(container);

          var sizes = {height: newc.height(), width: newc.width()};

          var dP = d3.timeParse("%s");


          data = data.map(function(d) {
        			return {
        				date: dP(d.timeStamp),
        				open: +d.quote.open,
        				high: +d.quote.high,
        				low: +d.quote.low,
        				close: +d.quote.close,
        				volume: +d.quote.volume
        			};
            })

            data = data.slice(0, data.length - 150)
          // defaultidentikit margins
          var margin = {top: 25, right: 0, bottom: 20, left: 0},
            width = sizes.width - margin.left - margin.right,
            height = sizes.height - margin.top - margin.bottom;

          var parseTime = d3.timeParse("%d-%b-%y");

          var x = techan.scale.financetime().range([0, width]).outerPadding(0); // oh yea i forgot to mention we use techan as a dependency lmao
          var y = d3.scaleLinear().range([height, 0]);

          var xAxis = d3.axisBottom(x).tickSizeOuter(0).tickSizeInner(0).ticks(20);//.tickFormat(identikit.monthTickF);

          var close = techan.plot.close()
            .xScale(x)
            .yScale(y);

          var svg = d3.select(container) // this probs isn't right
            .append("svg")
            .attr("width", width + margin.left + margin.right)
          	.attr("height", height + margin.top + margin.bottom)
          	.append("g")
          	.attr("transform", "translate(" + margin.left + " ," + margin.top + " )");

          x.domain(identikit.completeXDate("1d", data.map(function(d){return d.date})));
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
          }

      return identikit;
    }
    if(typeof(identikit) === 'undefined'){
        window.identikit = init();
    }
})(window);
