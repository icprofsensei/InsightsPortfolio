let section = document.querySelector('section');
let secwid = section.clientWidth;
let sechei = section.clientHeight;

function arraymaker(fileloc) {
    return new Promise((resolve, reject) => {
        // Construct the static URL dynamically for Django
        const staticFilePath = fileloc;

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
                    header: false, // Set to true if the CSV has headers
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
function drawcorrheatmap(file, element, title) { 
    anychart.onDocumentReady(async function () {
        try {
            const rawData = await arraymaker(file);

            if (!rawData || rawData.length === 0) {
                console.error("No data loaded from CSV.");
                return;
            }
            const headers = rawData[0].slice(1); // Skip the first empty element in the first row
            const rows = rawData.slice(1); // Skip the header row
            console.log(headers)
            console.log(rows)
            var customColorScale = anychart.scales.ordinalColor();
            customColorScale.ranges([
              {less: -0.75},
              {from: -0.75, to: -0.50},
              {from: -0.50, to: -0.25},
              {from: -0.25, to: 0},
              {from: 0, to: 0.25},
              {from: 0.25, to: 0.50},
              {from: 0.50, to: 0.75},
              {greater: 0.75}
            ]);
            customColorScale.colors(["#004ce3", "#2566e9", "#5082e7", "#9aa0c1", "#c19a9c", "#c35569", "#c52643", "#c20024"]);
            // Transform raw data into the format required by AnyChart heatMap
            const data = [];
            for (let i = 0; i < rows.length; i++) {
                const rowLabel = rows[i][0]; // First element in each row is the label
                for (let j = 1; j < rows[i].length; j++) { // Skip the row label
                    data.push({
                        x: headers[j - 1], // Column label
                        y: rowLabel, // Row label
                        heat: parseFloat(rows[i][j]) || 0 // Ensure values are numeric
                    });
                }
            }

            // Create the heatmap chart
            const chart = anychart.heatMap(data);
            chart.width(secwid);
            chart.height(sechei);
            chart.margin(0);
            chart.xAxis().title("Columns");
            chart.yAxis().title("Rows");
            chart.legend(true);
            // Set heatmap title and color scale (optional)
            chart.title(title);
            chart.colorScale(customColorScale);
            // Set the container id
            chart.container(element);
            chart.title().fontSize(25);
            if (secwid <= 900){
                chart.yAxis().labels().enabled(false);
                chart.xAxis().labels().enabled(false);
                chart.legend().fontSize(10).itemsLayout("horizontal-expandable");
                var tooltip = chart.tooltip();
                tooltip.positionMode("point"); 
                tooltip.format("Row: {%y}\nColumn: {%x}\nValue: {%heat}")  
            }
            
            // Draw the chart
            chart.draw();
        } catch (error) {
            console.error("Error initializing the chart:", error);
        }
    });
}
