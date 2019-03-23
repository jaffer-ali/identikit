(function(window){
    'use strict'
    function init(){
        var watchtower = {
          yahoo_finance: {}
        };

        watchtower.req = function(l){
          return new Promise(function(resolve, reject){
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
              if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(this.responseText);
                resolve(response);
              }
              else if(this.status >= 400){
                throw this.status;
              }
            }

            xhr.open("GET", ("https://cors-anywhere.herokuapp.com/" + l));
            xhr.setRequestHeader("Accept", 'application/json');
            xhr.send();
          })
        }


        watchtower.yahoo_finance.FormatData = function(b, compact){

          let meta = b.chart.result[0].meta
          let tS = b.chart.result[0].timestamp
          let q  = b.chart.result[0].indicators.quote[0]

          var retData = {
            "meta":{
                "ticker":meta.symbol,
                "exchange":meta.exchangeName,
                "source":[{
                  "name": "Yahoo Finance",
                  "link": "finance.yahoo.com"
                 }
                ],
                "timeRange":{
                  "startDate": tS[0],
                  "endDate": tS[tS.length - 1],
                }
              },
                "interval": meta.dataGranularity,
                "stockData": []
          }

          for(var i = 0; i <= tS.length - 1; i++){
            if(compact == true){
              retData.stockData.push({
                "timeStamp": tS[i],
                "quote": {
                  "close": q.close[i],
                  "volume": q.volume[i]
                }
              })
            } else {
              retData.stockData.push({
                "timeStamp": tS[i],
                "quote": {
                  "close": q.close[i],
                  "low": q.low[i],
                  "volume": q.volume[i],
                  "high": q.high[i],
                  "open": q.open[i]
                }
              })
            }
          }

          return retData;
        }

        watchtower.yahoo_finance.lengthRange = function(ticker, granularity, range){ // we've got a sick meme going on here
          return new Promise(function(resolve, reject){
            let link = "https://query1.finance.yahoo.com/v7/finance/chart/" + ticker + "?&interval=" + granularity + "&range=" + range;
            watchtower.req(link).then(function(val){
              resolve(watchtower.yahoo_finance.FormatData(val, false));
            }, reject);
          })
        }

        watchtower.yahoo_finance.dateRange = function(ticker, granularity, startDate, endDate){// for a range of dates, period1 and period2 are the start and end date (unix TS)
          return new Promise(function(resolve, reject){
            let link = "https://query1.finance.yahoo.com/v7/finance/chart/" + ticker + "?&interval=" + granularity + "&period1=" + startDate + "&period2=" + endDate
            watchtower.req(link).then(function(val){
              console.log(val)
              resolve(watchtower.yahoo_finance.FormatData(val, false));
            }, reject);
          })
        }
        return watchtower;
    }
    if(typeof(watchtower) === 'undefined'){
        window.watchtower = init();
    }
})(window);
