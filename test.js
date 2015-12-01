var scraperjs = require('scraperjs');
scraperjs.DynamicScraper.create('https://www.nvesto.com/tpe/1101/majorForce#!/fromdate/2015-11-27/todate/2015-11-27/view/detail')
    .scrape(function($) {
        return $("tr").map(function() {
            console.log($(this));
            return $(this);
        }).get();
    })
    .then(function(news) {
        console.log(news);
    })