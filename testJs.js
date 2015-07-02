/* 
    Example usage of tableWeightedAverage
*/


//  *********** some example data ************************
var data = [
    { Phase: "p1", Step: "s1", Task: "t1", Qty: "5",tv:"10",Price:3.51},
    { Phase: "p1", Step: "s1", Task: "t2", Qty: "10",tv:"20",Price:3.52 },
    { Phase: "p1", Step: "s2", Task: "t1", Qty: "15",tv:"100",Price:3.53 },
    { Phase: "p1", Step: "s2", Task: "t2", Qty: "20",tv:"200",Price:3.54 },
    { Phase: "p2", Step: "s1", Task: "t1", Qty: "25",tv:"1000",Price:3.55 },
    { Phase: "p2", Step: "s1", Task: "t2", Qty: "30",tv:"2000",Price:3.56 },
    { Phase: "p2", Step: "s2", Task: "t1", Qty: "35",tv:"10000",Price:3.57 },
    { Phase: "p2", Step: "s2", Task: "t2", Qty: "40",tv:"20000",Price:3.58 }
];
//  *********** END some example data ************************



// ********************  display on load *********************
$(document).ready(function(){
// original data
    var allColumnsToDisplay = ["Phase","Step","Task","Qty","tv","Price"];
    __veryUglyTable("mytable","mytableheader",data,allColumnsToDisplay);

// ********** first example ***********
// create groupBy array.  We will create new records from combinations of the values
//   in these columns. 
    var groupByCols = ["Phase","Step"];

// create totalingArray.  Sum up Qty
    var totalingArray1 = [
      ["Qty",["Qty"]],
    ];

//  create new aggregated version of data 
    var allColumnsToDisplay1 = _.union(
        groupByCols,
        [totalingArray1[0][0]]);

    // aggregate the data to form weighted averages by Phase and Step
    var aggregatedDataArray1 = tableSumProduct(data,groupByCols,totalingArray1);
    // display the data
    __veryUglyTable("mytable1","mytableheader1",aggregatedDataArray1,allColumnsToDisplay1);
// ************* END first example

// ************** second example *******************
//    sumProduct of the columns in subscript 1 (e.g. ["Price","Qty"])
    var totalingArray2 = [
      ["SumProdPriceQty",["Price","Qty"]],
    ];

//  create new aggregated version of data 
    var allColumnsToDisplay2 = _.union(
        groupByCols,
        [totalingArray2[0][0]]);

    // aggregate the data to form weighted averages by Phase and Step
    var aggregatedDataArray2 = tableSumProduct(data,groupByCols,totalingArray2);
    // display the data
    __veryUglyTable("mytable2","mytableheader2",aggregatedDataArray2,allColumnsToDisplay2);
// ************** END second example *******************

// ************** third example *******************
//    weighted average of the columns in subscript 1 (e.g. ["Price","Qty"])
    var totalingArray3 = [
      ["Qty",["Qty"]],
      ["Price",["Price","Qty"]],
    ];

//  create new aggregated version of data 
    var allColumnsToDisplay3 = _.union(
        groupByCols,
        [totalingArray3[0][0]],
        [totalingArray3[1][0]]);

    // aggregate the data to form weighted averages by Phase and Step
    var aggregatedDataArray3 = tableWeightedAverage(data,groupByCols,totalingArray3);
    // display the data
    __veryUglyTable("mytable3","mytableheader3",aggregatedDataArray3,allColumnsToDisplay3);
// ************** END third example *******************

// ************** fourth example *******************
//    weighted average of the columns in subscript 1 (e.g. ["Price","Qty"])
//   BUT NOT GROUP BY
    var totalingArray4 = [
      ["Qty",["Qty"]],
      ["Price",["Price","Qty"]],
    ];

//  create new aggregated version of data 
    var allColumnsToDisplay4 = _.union(
        [totalingArray4[0][0]],
        [totalingArray4[1][0]]);

    // aggregate the data to form weighted averages by Phase and Step
    var aggregatedDataArray4 = tableWeightedAverage(data,[],totalingArray4);
    // display the data
    __veryUglyTable("mytable4","mytableheader4",aggregatedDataArray4,allColumnsToDisplay4);
// ************** END fourth example *******************

// ************** fifth example *******************
//    weighted average of the columns in subscript 1 (e.g. ["Price","Qty"])
//   BUT NOT GROUP BY
    var totalingArray5 = [
      ["Qty",["Qty"]],
    ];

//  create new aggregated version of data 
    var allColumnsToDisplay5 = _.union(
        [totalingArray5[0][0]]
    );

    // aggregate the data to form weighted averages by Phase and Step
    var aggregatedDataArray5 = tableWeightedAverage(data,[],totalingArray5);
    // display the data
    __veryUglyTable("mytable5","mytableheader5",aggregatedDataArray5,allColumnsToDisplay5);
// ************** END fifth example *******************

});
// ********************  END display on load *********************
