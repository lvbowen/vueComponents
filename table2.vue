<template>
    <div class="table-responsive" v-if="option">
      <table class="table table-striped table-bordered table-responsive">
        <thead>
          <tr>
            <template v-if="option.isNeedSort">
                <th v-if="option.isNeedCheckBox" class="has-check">
                  <div class="select-box"><input type="checkbox" value="true" v-model="allChecked" /><label class="iconfont"></label>
                        </div>
                </th>
                <th v-for="(head,index) in option.tHeaders" @click.stop.prevent="sortEvent(index,head.asc)">                                 
                 {{head.colName}}           
                  <template v-if="head.fieldName">
                    <i class="iconfont asc" v-if='head.asc'>&#xe644;</i>
                    <i class="iconfont" v-else>&#xe645;</i>
                  </template>
                </th>
            </template>
            <template  v-else>
                <th v-if="option.isNeedCheckBox">
                  <div class="select-box"><input type="checkbox" value="true" v-model="allChecked" /><label class="iconfont"></label>
                        </div>
                </th>
                <th v-for="(head,index) in option.tHeaders">             
                    {{head.colName}}
                </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <slot v-if="option.tBodys.length>0"></slot>
          <tr v-else class="noData">
            <td v-if="option.isNeedCheckBox" :colspan="option.tHeaders.length+1">暂无数据</td>
            <td v-else :colspan="option.tHeaders.length">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
<script>
  export default{
    props: ['option'],
    data:function(){
      return {
        allChecked:[],
      }
    },
    watch:{
      allChecked:function(bool){
          var _bool=false;
          if(bool.length==1&&bool[0])
            _bool=true;
          //把全选状态传递到父组件
          this.$emit('allChecked',{bool:_bool,tabId:this.option.id});
      },
    },
    methods:{
      sortEvent:function(_num,_asc){
        this.option.tHeaders.forEach((item,index)=>item.asc=false);
        if(this.option.tHeaders[_num].fieldName){
          this.option.tHeaders[_num].asc=!_asc;
          this.$emit('setSort',this.option.tHeaders[_num]);
        };
      },      
    },
  };
</script>