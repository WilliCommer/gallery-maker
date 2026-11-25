/************************************************

# sorter.js

> some sorting tools
> V.4.1 2022-07-12

This module supports sorting of objects.

The sort order `cols` is a list of column (property) names for sorting. 
String  and Array are allowed. 
A minus sign as prefix to column name results in descending order. 
Use 'dot syntax' for deep properties.



**Examples**

- 'id'
  sort on property 'id'

- '-id'
  sort on property 'id' descending

- 'name,-age'
  sort on property 'name' and then on 'age' descending

- 'address.name'
  sort on property 'name' in object 'address'

- 'array.1.name'
  sort on array 'array' at index 1 and property 'name'



## Exported Functions

### `function sortFunc (cols, compare = compareAny) `

Return a function to be used by Array.sort()
usage: `array.sort( sortFunc('name') );`


### `function sortList (list, cols, compare = compareAny)`

Returns a sorted **copy** of `list`, does not affect `list`.




### `function compareAny (a, b)`

Compare object a with b. 

| case      | return |
| --------- | ------ |
| a > b     |   > 1  |
| a < b     |   < 1  |
| a = b     |     0  |

A simple comparer using `localeCompare` to compare strings



### `function compareNumber (a, b)`

Like `compareAny`, but try to parse strings to number before compare.




# History

Version 4.1 2022-07-12
- comments changed
- remove sortObjectListByColums

Version 4 2021-04-21
- compareNumber

Version 3 2020-05-24
- export all functions
- new sortFunc
- test-sort.js

Version 2 2020-03-19

*************************************************/





/*
    Compare Functions
*/


function compareAny (a, b) {

    if ((typeof a === 'string') && (typeof b === 'string'))
        return a.localeCompare(b);

    let result = a - b;
    return Number.isNaN(result) ? 0 : result;
}


function compareNumber (a, b) {
    var na = Number(a), nb = Number(b);     
    if (!isNaN(na) && !isNaN(nb))
        return na - nb;
    return compareAny(a,b)
}





/*
    parseSortList

    input: 'name,-age'  or ['name','-age']
    output: [
        {key: 'name', desc: false, val(obj)},
        {key: 'age',  desc: true,  val(obj)}
    ]

    **new** in version 2: property path
    'customer.name,-user.age'


*/


function parseSortList ( cols = []) {

    // array or string ?
    if (typeof cols === 'string') 
        cols = cols.split(',');

    return cols.map( e => {
        e = String(e);
        let key  = e;
        let desc = (e[0] === '-');  // is it descending order
        if (desc) key = e.substring(1);

        // is key a prop. name or a path ?
        var path = key.split('.');

        const val1 = (obj) => obj[key];         // get value from prop. name

        const val2 = (obj) => {                 // get value from path
            for (let i in path)
                try { obj = obj[path[i]] } 
                catch (err) { return }
            return obj
        }

        var val = (path.length > 1) ? val2 : val1;      // chose value access

        return {key, desc, val};
    });
}




/*
    sortFunc
   
*/


function sortFunc (cols, compare = compareAny) {

    cols = parseSortList(cols);

    return function (a, b) {
        let res = 0;
        for (let i=0; i < cols.length; i++) {
            let aa = cols[i].val(a);
            let bb = cols[i].val(b);;
            res = compare(aa, bb);
            if (cols[i].desc) res = -res;
            if (res !== 0) return res;
        }
        return res;
    };
}






/*
    sortList
*/ 


function sortList (list, cols, compare = compareAny) {

    if (!list || !list.length || !cols) 
        return list;

    return [...list].sort( sortFunc(cols,compare) );
}







// module.exports = {
//     sortFunc,
//     sortList,
//     compareAny, 
//     compareNumber,

//     sortObjectListByColums: sortList,               // deprecated function name
// }


export {
    sortFunc,
    sortList, 
    compareAny, compareNumber,
}