<template>
	<div>
			<ul class="def-paging" v-if="currentPNum>1">
					<li>
						<button type="button" class="btn btn-page iconfont" @click="prev()" :disabled="dynamicCheckIndex<=1">&#xe608;</button>
					</li>
					<li>
						<button type="button" class="btn btn-page iconfont" @click="prev()" :disabled="dynamicCheckIndex<=1">&#xe608;</button>
					</li>
					<li class="fyAllNum">
						<input class="jump-page btn btn-page num" type="text" ref="search" v-model.trim="inputCIndex" v-if="isSearch" @blur="toggleSearch" @keyup.enter="submit">
						<button type="button" class="btn btn-page num" v-else @click="toggleSearch">
							{{dynamicCheckIndex}}/{{currentPNum}}
						</button>
						
					</li>
					<li>
						<button type="button" class="btn btn-page iconfont" @click="next()" :disabled="dynamicCheckIndex>=this.currentPNum">&#xe609;</button>
					</li>
					<li>
						<button type="button" class="btn btn-page iconfont" @click="next()" :disabled="dynamicCheckIndex>=this.currentPNum">&#xe609;</button>
					</li>
					<li class="fynum">
						共{{totalCount}}条信息
						<!--跳转到第<input class="jumpPage" type="text" v-model="inputCIndex">页
						<button type="button" class="pagerGo" value="确定" @click="submit()">确定</button>-->
					</li>
			</ul>
	</div>
</template>

<script>   
			export default {
			    props:{
				  pageSize:{
				    type:Number,
					default:12
				  },
				  checkIndex:{
				    type:Number,
					default:1
				  },
				  pageNum:{
				     type:Number,
					 default:2
				  },
				  totalCount:{
				      type:Number,
					  default:1
				  }				  
				},		
				data(){		
				  return {		    
				    currentCIndex:1,
					//默认索引		    			
					 defInputCIndex:1,
					 //是否显示搜索框
					 isSearch:false		
				  }		  
				},
				computed:{
				  currentPNum:function(){
						var _pageNum=this.totalCount%this.pageSize?parseInt(this.totalCount/this.pageSize)+1:this.totalCount/this.pageSize; 
            			return _pageNum;
				  },
				  //动态索引，通常为父组件传入
				  dynamicCheckIndex:{
				    get:function(){
						return this.checkIndex;
					}	
				  },
				 //当前页索引变化时执行的回调函数（输入框里面的数值）
				  inputCIndex:{		            	 
		            get:function(){     
					  var _inputCIndex=this.defInputCIndex;
					  //参数为null,""，undefined或为零
					  var isNotEmptyorZero=!_inputCIndex;
					  if(isNotEmptyorZero)
					  {
					    //defInputCIndex=this.inputCIndex;
					    //return this.currentCIndex;
						return;
					  }
					  
					  var num=parseInt(_inputCIndex);
					  //不是整型
					  var isNotInt=num;
					  if(!isNotInt || isNotInt && num>this.currentPNum)
					  {
					        this.defInputCIndex=this.currentCIndex;
						  return this.dynamicCheckIndex;
					  }	  			 
					  return num;
					},		  
				    set:function(newVar){
		              this.defInputCIndex=newVar;						  
					}
				  }
				},				
		        methods:{
				   prev:function(){
				       var _checkIndex=this.check=this.checkIndex-1;			   
							var isEqualMin=_checkIndex==1;
							var isEqualMan=_checkIndex==this.currentPNum;
							var isLtOE1AndGtOEPN=(_checkIndex>=1&&_checkIndex<=this.currentPNum);
								if(isLtOE1AndGtOEPN) 
								{
									//这里要响应到父组件
										this.$emit('toPage', _checkIndex);
								}
							if(isEqualMin)
								{
									//console.log("已达最小分页值");
								}
				   },
				   next:function(){
				      var _checkIndex=this.check=this.checkIndex+1;			   
							var isEqualMin=_checkIndex==1;
							var isEqualMan=_checkIndex==this.currentPNum;
							//大于等于1和小于等于最大页数
							var isLtOE1AndGtOEPN=(_checkIndex>=1&&_checkIndex<=this.currentPNum);
								if(isLtOE1AndGtOEPN) 
								{
										//这里要响应到父组件
										this.$emit('toPage', _checkIndex);
								}
							if(isEqualMin)
								{
									//console.log("已达最小分页值");
								}
				   },
				   submit:function(){
				       var _checkIndex=this.inputCIndex;
								this.$emit('toPage', _checkIndex);
				   },
					 toggleSearch: function(){
						 //切换显示搜索框
						 this.isSearch = !this.isSearch; 
						 //获取焦点
						 this.$nextTick(function(){
							 if(this.isSearch)
						 		this.$refs.search.focus();
						 });
					 }
				}		
			}

		</script>