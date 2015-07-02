/* 
// Group an array of json objects by values of fields in the object, creating
//  sum, sumProduct and/or weighted average totalling fields.
// You will effectively create the "flattened" output of a pivot table.


//  Let's say you have an array of json objects:
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

//  Let's say you want to get those json objects totalled by Phase and Step:
    var groupByCols = ["Phase","Step"]; // group the objects by Phase and Step
    var totallingArray = [
      ["Qty",["Qty"]],
    ];  // total the objects by Qty

//  Now, create a new array that will have 4 objects
    var aggregatedDataArray = tableSumProduct(data,groupByCols,totallingArray);

//  Now, let's create a new array with a new field called QtyPrice, which is the sumProduct of Qty
//    and Price, grouped by Phase and Step
    totallingArray = [
      ["Qty",["Qty"]],
      ["QtyPrice",["Price","Qty"]],
    ];
    aggregatedDataArray = tableSumProduct(data,groupByCols,totallingArray);    

//  Now, let's create yet another array where Price is the weighted average Price, and
//    Qty is the sum of Qty's for each grouping of Phase and Step
    totallingArray = [
      ["Qty",["Qty"]],
      ["QtyPrice",["Price","Qty"]],
    ];
    aggregatedDataArray = tableWeightedAverage(data,groupByCols,totallingArray);    

//  see testJs.js for this code in use.
*/



    hasIt = function(obj, target) {
        return _.any(obj, function(value) {
            return _.isEqual(value, target);
        });
    };

    propToAggregate = function(newPropertyName,oldPropertiesToCombineArray){
      this.newPropertyName = newPropertyName;
      this.oldPropertiesToCombineArray = oldPropertiesToCombineArray;
    };

    aggregate = function(data,groupByArr,propToAggregateArray,func){
      var stems =  _.reduce(
        data,
        function (memo, item) {
            var key = _.pick(item, groupByArr);
            if (!hasIt(memo, key)) {
                memo.push(key);
            }
            return memo;
        },
        []
      );

      var group =  _.map(stems, function(stem) {
        var o = {
              key: stem,
              vals:_.map(_.where(data, stem), function(item) {
                  return _.omit(item, groupByArr);
              })
          };
          return o;
          // return {
          //     key: stem,
          //     vals:_.map(_.where(data, stem), function(item) {
          //         return _.omit(item, groupByArr);
          //     })
          // };
      }, this);


      return _.map(group,
          function(item) {
            var ret = {};
            for(var i = 0;i<propToAggregateArray.length;i++){
              var propToAggregate = propToAggregateArray[i];
              var newPropName = propToAggregate.newPropertyName;
              ret[newPropName] = _.reduce(
                item.vals,
                function(memo, node) {
                  var valuesArray = [];
                  var columnsToAggregate = propToAggregate.oldPropertiesToCombineArray;
                  for(var j = 0;j<columnsToAggregate.length;j++){
                    var propertyOfThisNode = columnsToAggregate[j];
                    valuesArray.push(node[propertyOfThisNode]);
                  }
                  return func(memo,valuesArray);
                },
                0);
              }
            return _.extend({}, item.key,ret);
          });
    };


    function aggSumProduct(previous,valuesToMultiply){
        var product = 1;
        for(var i = 0;i<valuesToMultiply.length;i++){
          var valueOfProp = valuesToMultiply[i];
          product = product * Number(valueOfProp);
        }
        var ret = previous + product;
        return ret;
    }

    function aggSumDivide2Values(previous,valuesToMultiply){
        var numerator = valuesToMultiply[0];
        var denominator = 1;
        if(valuesToMultiply.length>1){
          denominator = valuesToMultiply[1];
        }
        return previous + numerator/denominator;
    }

    var aggByArray = function(data,groupByArray,totalingArray,func){
      var propertiesToAggregateArray = [];
      for(var i = 0;i<totalingArray.length;i++){
        propertiesToAggregateArray[i] = new propToAggregate(totalingArray[i][0],totalingArray[i][1]);
      }
      var ret = aggregate(data,groupByArray,propertiesToAggregateArray,func);
      return ret;
    };

    //  ********* tableSumProduct **********
    //  Produce the sumProduct of a set of columns, or just the sum.
    //  Arguments:
    //  arg0  (data) : a json array of data
    //  arg1  (groupByArray): an array of strings that have the names of fields in each json object.  
    //     tableSumProduct will group it's output by unique combinations of the values
    //     in these fields.
    //  arg2  (totalingArray): an array of arrays, where the inner array items are as follows:
    //     arg2[i][0]: the name of the new field whose value will be the sum per that groupBy;
    //     arg2[i][1]: an array of fields names, whose values get multiplied together to form
    //                 the product of each element of the sumProduct.
    //    Example of arg2 (totalingArray):
    //        var totalingArray = [
    //            ["Qty",["Qty"]],
    //            ["Price",["Price","Qty"]],
    //        ];
    //
    // Compute the sum product for each column that you pass in totalingArray.  Group
    //   all table items by the columns provided in groupByArray
    //
    // TotalingArray is an array of arrays.  Each innner array has 2 dimensions:
    //   The first dimension is a column name that will appear in the table, AFTER 
    //      sumByArray is done.
    //
    //   The second dimension is another array of columns that will be multiplied together
    //      to create the "products" for the "sumproduct"
    //      If this second dimension is an array with only one element, then tableSumProduct
    //      will produce the sum of that column.
    var tableSumProduct = function(data,groupByArray,totalingArray){
      return aggByArray(data,groupByArray,totalingArray,aggSumProduct);
    };

    // *********** tableWeightedAverage **********************
    //  Arguments:
    //  arg0  (data) : a json array of data
    //  arg1  (groupByArray): an array of strings that have the names of fields in each json object.  
    //     tableSumProduct will group it's output by unique combinations of the values
    //     in these fields.
    //  arg2  (totalingArray): an array of arrays, where the inner array items are as follows:
    //     arg2[i][0]: the name of the new field whose value will be the sum per that groupBy;
    //     arg2[i][1]: an array of fields names, whose values get multiplied together to form
    //                 the product of each element of the sumProduct.
    //     
    // Produce a weighted average of the sets of columns that you pass in totalingArray.
    //    This method will do the following:
    //       1. Produce sumProducts for each pairs of columns;
    //       2. Divide each sumProduct by the value of the second element of the pair.
    //       For example, if you have 2 columns, Price and Qty, and you want to produce
    //          the weighted average Price, then the totallingArray parameter that you pass
    //          to tableWeightedAverage should have one element: ["Price",["Price","Qty"]].
    //          The first element, "Price", specifies what name you want for the new
    //             weighted average column.  The second element, the array ["Price","Qty"] tells
    //             tableWeightedAverage to multiply Price X Qty, and then divide by Qty.
    var tableWeightedAverage = function(data,groupByArray,totalingArray){
      var initialSumData = tableSumProduct(data,groupByArray,totalingArray);
      return aggByArray(initialSumData,groupByArray,totalingArray,aggSumDivide2Values);
    };


// **************** __veryUglyTable **************************
//    this is a little table creation helper - JUST FOR THIS EXAMPLE
function __veryUglyTable(tableId,tableHeaderId,data,columnArray){
// add column headers to your table
    for(var i = 0;i<columnArray.length;i++){
      var tr = '<td>' + columnArray[i] + '</td>';
       $("#"+tableHeaderId).append(tr);
    }

// now add table data
    for(var m =0;m<data.length;m++){
      var tr = "<tr>";
      for(var i = 0;i<columnArray.length;i++){
        var currentDataItem = data[m];
        var currentColumn = columnArray[i];
        var td = '<td>' + currentDataItem[currentColumn] + '</td>';
        tr = tr+td;
      }
      tr = tr + '</tr>';
      $("#"+tableId).append(tr);
    }
}
// **************** END __veryUglyTable **************************
