<template>
	<div class="collItem panel panel-default">

		<div class="panel-heading collItem-heading" data-toggle="collapse" data-parent="#accordion" :href="'#'+collapsingId" :class="{collapsed:!instate}">
			<h4 class="panel-title">
				<span class="collItem-ltitle">{{title}}</span>
				<button class="btn btn-default btn-refresh" v-if="eventList.refresh" :id="eventList.refreshId"><i class="comfont">&#xe60c;</i><span>刷新</span></button>
				<!--<button class="btn btn-default btn-sm close-search" v-if="eventList.closeSearch" :id="eventList.closeSearchId"><i class="comfont">&#xe60f;</i><span>关闭查询</span></button>
				<button class="btn btn-default btn-sm output-table" v-if="eventList.export" :id="eventList.exportId"><i class="comfont">&#xe610;</i><span>导出</span></button>-->
				<a class="op-cl-coll">
					<span class="up"><a href="javascript:void(0)">收缩</a><i class="comfont"></i></span>
					<span class="down"><a href="javascript:void(0)">展开</a><i class="comfont"></i></span>
				</a>
			</h4>
		</div>
		<div :id="collapsingId" class="panel-collapse" :class="{in:instate,collapse:!instate}" ref="collapse">
			<div class="panel-body">
				<slot name="container">请填充需要显示的内容</slot>
			</div>
		</div>
	</div>
</template>

<script>
	var extend=function(){return null;};
	export default { 
		props:{
	      title:{
					type:String,
					default: "默认标题"
				},
			in:{
				type:Number,
				default: 0
			}
		},
		data(){
			return {
			}
		},
		watch:{
			instate:function(newValue){
				if(newValue){
					$(this.$refs.collapse[0]).collapse('show')
				}
			}
		},
		computed:{
			instate:function(){
				return this.in;
			},
			collapsingGuid: function(){
				return this.guid();
			},
			collapsingId: function(){
				return('FM_'+this.collapsingGuid);
			},
			eventList: function(){
				var _this = this;
				return{
					refreshId:"ref_" + _this.collapsingId,
					closeSearch:true,
					closeSearchId:"cls_" + _this.collapsingId,
					export:true,
					exportId:"exp_" + _this.collapsingId
				}
			}
		}
	}
</script>