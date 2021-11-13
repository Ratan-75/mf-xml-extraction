function Iterator(listToIterate) {
    var iterable = listToIterate;
    var intialIdx = -1;
    return  {

        hasNext : function() {
            return intialIdx+1 < iterable.length
        },
        next : function() {
            
            intialIdx++;
            if (intialIdx+1 > iterable.length ) {
                return null;
            }
            return iterable[intialIdx];
        }
    }
};

let list = [1,2,3,4,5];

var itr = new Iterator(list);

let counter;

while(itr.hasNext()){
    console.log(itr.next());
}

console.log()

exports.Iterator = Iterator;