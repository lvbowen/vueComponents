<template>
	<div class="table-responsive" data-pattern="priority-columns">
		<table class="table table-small-font table-bordered table-hover table-striped">
			<thead>
				<tr>
					<th v-if="select&&select=='radio'"></th>
					<th v-if="select&&select=='checkbox'">
						<div class="select-box"><input type="checkbox" v-model="allChecked"><label class="iconfont"></label>
                        </div>
					</th>
					<th v-for="(thead,index) in tHeaders">
						{{thead.name}}
					</th>
				</tr>
			</thead>
			<tbody v-if="!(!tContent || tContent.length==0)">
				<tr v-for="(tbody,index) in tContent">
					<td v-if="select&&select=='radio'">
						<div class="select-box"><input type="radio" v-model="picked" :value="tbody.checkValue">
						<label class="iconfont"></label>
                        </div>
					</td>
					<td v-if="select&&select=='checkbox'"><div class="select-box"><input type="checkbox" v-model="checked" :value="tbody.checkValue"><label class="iconfont"></label>
                        </div></td>
					<td v-for="(value,key) in tbody" v-if="key!='checkValue'">
						{{value}}
					</td>
				</tr>
			</tbody>
			<tbody v-else>
				<tr>
					<td :colspan="tHeaders.length" style="text-align: center;" data-priority="1" class="spn-cell">暂无数据</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script>
	export default {
	    props:{
	      	tHeaders:{
				type:Array
			},
			tBodys:{
				type:Array
			},
			select:{
				type:String
			},
			checkValue:{
				type:String
			}
		},
		data:function(){
			return{
				picked:"",
				checked:[]
			}
		},
		watch:{
			tContent:function(){
				//切换分页时清空单选框和复选框的值
				if(this.select == "radio")//返回单选框的值
					this.picked="";
				else if(this.select == "checkbox"){//返回复选框的值
					this.allChecked = false;
				}
			},
			picked:function(newPicked){
				//单选改变提交事件
				this.$emit('pickChange',newPicked);
			},
			checked:function(newChecked){
				//多选改变提交事件
				this.$emit('checkChange',newChecked);
			}
		},
		computed:{
			tContent:function(){
				var content = new Array(),
				item = new Object(),
				tBodys = this.tBodys,
				tHeaders = this.tHeaders;
				for(var i in tBodys){
					item = this.rank(tBodys[i]);
					content.push(item);
				}
				return content;
			},
			allChecked: {//全选、反选
				get: function() {
					return this.checked.length == this.tContent.length;
				},
				set: function(value) {
					if (value) {
						this.checked = this.tContent.map(function(item) {
							return item.checkValue
						})
					} else {
						this.checked = []
					}
				}
			},
		},
		methods:{
			rank:function(body){
				//将body数组里的信息按照头部关联
				var item = new Object(),
				tHeaders = this.tHeaders;				
				for(var i in tHeaders){
					var id = tHeaders[i].id;
					try {
						var value = Object.getOwnPropertyDescriptor(body, id).get();
					}
					catch(err){
						console.log(err);
					}
					
					Object.defineProperty(item, id, {
						value: value,
						writable: true,
						enumerable: true,
						configurable: true
					});
				}
				//初始化单选框和复选框的value值
				if(this.checkValue){
					item.checkValue = Object.getOwnPropertyDescriptor(body, this.checkValue).get();	
				}				
				return item;
			},
			getSelected:function(){
				if(this.picked && this.select){
					if(this.select == "radio"){//返回单选框的值
						return this.picked;
					}else if(this.select == "checkbox"){//返回复选框的值
						return this.checked;
					}
				}	
				
			}
		}		
	}
</script>
<style scoped>
.table-responsive[data-pattern="priority-columns"] th,
.table-responsive[data-pattern="priority-columns"] th[data-priority] {
	background-color: #fafafa;
	border-color: #fafafa;
	border-bottom-color: #DDDDDD;
	border-bottom-width:1px;
    font-weight:100
}
.table-striped>tbody>tr:nth-child(odd)>td{
	background-color: #FFF7F0;
}
.table-striped.table-hover>tbody>tr:hover>td{
	background-color: #efffeb;
}

table.focus-on tbody tr.focused td{
	background-color: #efffeb;
}
table.focus-on tbody tr.unfocused td{
	color: rgba(0,0,0,1);
}
</style>