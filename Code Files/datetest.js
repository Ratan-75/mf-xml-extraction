let exampleDate = '10 Jun 2021';

function convertDate(dateString){
    let date = new Date(dateString);
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let day = date.getDate();
    return (year + '-' + ((month <= 9) ? ('0' + month) : month) + '-' + ((day <= 9) ? ('0' + day) : day));
}


const arr = [1,2,1,2,1,2,4,5,2,3,4,3,4,5,6,2,4,6,4,1];

const newArr = [...new Set(arr)];



function convertToArrayOfObj(inArr) {
    let modifArr = []
    for(let id of inArr){
        modifArr.push({id})
    }
    return modifArr
}

console.log(convertToArrayOfObj(newArr));


