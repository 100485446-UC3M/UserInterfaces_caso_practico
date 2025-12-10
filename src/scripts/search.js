function searchName(data, searchStr){
    data.filter(function(item){
        return item["name"].includes(searchStr);
    });
    return data;
}