/*
 * @Author: 钮宇豪 
 * @Date: 2016-11-29 15:56:16 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2016-12-28 10:20:11
 */
<template>
    <div class="dropdown drbot">
        <button class="btn btn-default" data-toggle="dropdown" type="button" :id="idForStyle">
            <em>{{showText}}</em><i class="iconfont"></i>
        </button>
        <ul class="dropdown-menu">
		    <li v-for="item in option" @click="setOption(item.value,item.text)">
                <a href="javascript:void(0);">{{item.text}}</a>
            </li>
		  </ul>
    </div>
</template>

<script>
    export default {
        props:{
            value: {//选中项绑定model
                required: true

            },
            option:{//选项信息|键名为实际值|键值为显示值
                required: true,
                type: Array
            },
            def:{//设置默认值
            },
            idForStyle:{    //设置样式
                type:String,
                default:''
            }
        },
        data: function(){
            return{
                default:"",//默认值
                showText:""//默认文本
            }
        },
        mounted:function(){
           this.init();
        },
        watch:{
            option: function(){
                this.init();
            },
            def: function(){
                this.init();
            }
        },
        methods:{
            setOption:function(value,text){
                this.showText = text;
                this.$emit('input',value);
            },
            init: function(){
                try{
                    
                    if(this.value){
                        this.default = this.value;
                        this.showText = this.option.filter(item=>item.value==this.default)[0].text;
                    }else if(this.option.length>0){
                        //设置默认值为第一个
                        this.default = this.option[0].value;
                        this.showText = this.option[0].text;
                    }
                    // 通过 input 事件发出
                    this.$emit('input',this.default);
                }catch(err){
                    console.log(err);
                }
            }
        }
    }
</script>

<style scoped>
    button{
        padding:0 35px 0 10px;
    }
    em{
        font-style: normal;
        color:#777;
    }
    #blueBg {
        background:rgba(38,172,246,1);
        border:none;
    }
    #blueBg em, #blueBg i.iconfont{
        color: white;
    }
    ul.dropdown-menu{max-height:200px;overflow-x:hidden;}
</style>