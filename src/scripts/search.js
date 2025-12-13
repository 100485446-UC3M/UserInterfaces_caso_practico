function searchName(data, searchStr){
    data =  data.filter(function(item){
        return item["name"].toUpperCase().includes(searchStr.toUpperCase());
    });
    return data;
}

//function searchFilter(data, )