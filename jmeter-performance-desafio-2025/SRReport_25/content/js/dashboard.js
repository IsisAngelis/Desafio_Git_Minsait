/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 80.88235294117646, "KoPercent": 19.11764705882353};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8069852941176471, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "HTTP Request → Cadastrar Usuários para Login"], "isController": false}, {"data": [0.5, 500, 1500, "Requisição JDBC"], "isController": false}, {"data": [1.0, 500, 1500, "Debug testador"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request → Cadastrar Usuário"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request → Realizar Login"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request → Listar Usuário"], "isController": false}, {"data": [0.32432432432432434, 500, 1500, "HTTP Request → Excluir Usuário"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request → Logar Usuário com CSV"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 272, 52, 19.11764705882353, 8.397058823529422, 0, 890, 3.0, 10.0, 19.099999999999795, 48.61999999999989, 22.870596148995208, 18.42782387749096, 3.279075664256285], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request → Cadastrar Usuários para Login", 4, 0, 0.0, 16.0, 3, 46, 7.5, 46.0, 46.0, 46.0, 6.097560975609756, 3.0070979420731705, 1.9590796493902438], "isController": false}, {"data": ["Requisição JDBC", 1, 0, 0.0, 890.0, 890, 890, 890.0, 890.0, 890.0, 890.0, 1.1235955056179776, 0.8942679073033708, 0.0], "isController": false}, {"data": ["Debug testador", 79, 0, 0.0, 0.3670886075949367, 0, 6, 0.0, 1.0, 1.0, 6.0, 7.192934535190749, 4.166328786533734, 0.0], "isController": false}, {"data": ["HTTP Request → Cadastrar Usuário", 20, 0, 0.0, 16.950000000000003, 4, 53, 7.5, 46.900000000000006, 52.699999999999996, 53.0, 24.301336573511545, 11.984545868772782, 7.805380467800729], "isController": false}, {"data": ["HTTP Request → Realizar Login", 20, 0, 0.0, 5.249999999999999, 2, 13, 5.0, 9.900000000000002, 12.849999999999998, 13.0, 25.510204081632654, 17.649125079719386, 6.828463807397959], "isController": false}, {"data": ["HTTP Request → Listar Usuário", 70, 0, 0.0, 7.442857142857142, 1, 33, 7.0, 13.799999999999997, 23.0, 33.0, 6.588855421686747, 10.074937199971762, 0.7978692112198795], "isController": false}, {"data": ["HTTP Request → Excluir Usuário", 74, 50, 67.56756756756756, 4.283783783783786, 1, 10, 4.5, 6.0, 7.0, 10.0, 7.524913565182021, 3.8238270922310353, 1.6681204875940614], "isController": false}, {"data": ["HTTP Request → Logar Usuário com CSV", 4, 2, 50.0, 4.75, 2, 12, 2.5, 12.0, 12.0, 12.0, 6.589785831960461, 3.7807609143327845, 1.7375411861614498], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 50, 96.15384615384616, 18.38235294117647], "isController": false}, {"data": ["401/Unauthorized", 2, 3.8461538461538463, 0.7352941176470589], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 272, 52, "400/Bad Request", 50, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request → Excluir Usuário", 74, 50, "400/Bad Request", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request → Logar Usuário com CSV", 4, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
