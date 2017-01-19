export default function(){
    return {
        allChecked: function (bool,_id) {
            for(var i in this.tableList){
                if(this.tableList[i].id==_id){
                    if (bool) {//全选            
                        if (this.tableList[i].tBodys && this.tableList[i].tBodys.length > 0) {
                            this.tableList[i].chooseItem = this.tableList[i].tBodys.map(function (item) {
                                return item;
                            });
                        };
                    } else {//全不选
                        this.tableList[i].chooseItem = [];
                    };
                    break;
                }
            };
        }
    };
}