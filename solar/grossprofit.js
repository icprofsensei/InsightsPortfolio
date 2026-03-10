function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
function arraymaker(fileloc) {
    return new Promise((resolve, reject) => {
        // Construct the static URL dynamically for Django
        const staticFilePath =fileloc;

        // Fetch the CSV file
        fetch(staticFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(csvData => {
                // Parse the CSV data using PapaParse
                Papa.parse(csvData, {
                    header: true, // Set to true if the CSV has headers
                    skipEmptyLines: true, // Ignore empty lines
                    complete: function(results) {
                        resolve(results.data);
                    }
                });
            })
            .catch(error => {
                console.error(`Error loading the CSV file from ${fileloc}:`, error);
                reject(error);
            });
    });
}

function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
}


function drawgp(file, html, title, xlab, ylab) {
    anychart.onDocumentReady(async function () {
        try {
            const data = await arraymaker(file);
            if (!data || data.length === 0) {
                console.error("No data loaded from CSV.");
                return;
            }

            const chart = anychart.cartesian();
            const cols = Object.keys(data[0]).filter(item => item !== 'x');
            dataarrupper = []
            dataarrlower = []
            cost = []
            rev = []
            for (let i = 0; i < data.length; i ++){

                    if (data[i]['Rev'] > data[i]['Cost']) {
                        dataarrupper.push( {x: new Date(data[i]['DATE']),   low:parseFloat(data[i]['Cost']), high: parseFloat(data[i]['Rev'])   } )
                        dataarrlower.push( {x: new Date(data[i]['DATE']),   low: parseFloat(data[i]['Cost']), high: parseFloat(data[i]['Cost']) } )
                    }
                    else {
                        dataarrupper.push( {x: new Date(data[i]['DATE']),   low:parseFloat(data[i]['Rev']), high: parseFloat(data[i]['Rev'])   } )
                        dataarrlower.push( {x: new Date(data[i]['DATE']),   low: parseFloat(data[i]['Cost']), high: parseFloat(data[i]['Rev'])  } )
                    }
                    cost.push( {  x: new Date(data[i]['DATE']), value: parseFloat(data[i]['Cost']) } )
                    rev.push( {  x: new Date(data[i]['DATE']), value: parseFloat(data[i]['Rev']) } )
                

                
            }
                const upperSeries = chart.rangeSplineArea(dataarrlower);
                upperSeries.name(`Unprofitable`);
                upperSeries.fill('#c26e75', 0.3);
                upperSeries.stroke('#c26e75');  
                const costseries = chart.spline(cost);
                costseries.fill('#7a000a', 0.3);
                costseries.stroke('#7a000a');
                costseries.name(`Cost`);
                const lowerSeries = chart.rangeSplineArea(dataarrupper);
                lowerSeries.name(`Profitable`);
                lowerSeries.fill('#787cf5', 0.3);
                lowerSeries.stroke('#787cf5');  
                const revseries = chart.spline(rev);
                revseries.fill('#030bfc', 0.3);
                revseries.name(`Revenue`);
                revseries.stroke('#030bfc')

            chart.legend().enabled(true);
            chart.legend().fontSize(10);
            chart.title(title);
            chart.title().fontSize(20)
            if (Object.keys(data[0])[0].toUpperCase() == 'DATE') {
                console.log(dataarrlower)
                chart.xScale('date-time'); 
                chart.xAxis().labels().format(function () {
                    var date = new Date(this.value);
                    return date.toLocaleDateString();
                });
            } else {
                chart.xAxis().labels().format(function (value) {
                    return Math.round(value);
                });
            }
            chart.xAxis().title(xlab);
            chart.yAxis().title(ylab);
            chart.container(html);
            chart.draw();
        } catch (error) {
            console.error("Error initializing the chart:", error);
        }
    });
}
