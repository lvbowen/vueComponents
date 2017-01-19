<template>
    <script :id="editorId" type="text/plain" v-bind:style="editorStyle"> </script>
</template>

<script>

export default{
    data:function(){
        return{
            editorId:null,
            editorStyle:{
                height:"300px",
            },
            ue_pb:null,
            ue_pb_ready:false,
        }
    },
    props:{
        //设置编辑器内容
        setMsg:{
            type:String,
            default:''
        },        
    },
    computed:{
        content:function(){
            return this.setMsg;
        },
    },
    watch:{
        content:function(msg){
            var _this=this;
            if(_this.ue_pb_ready){
                _this.ue_pb.setContent(decodeURI(msg), false);
            }else{
                _this.ue_pb.addListener("ready", function () {
                     _this.ue_pb.setContent(msg, false); 
                });
            };
        },
    },
    beforeMount:function(){
        this.editorId=this.getRandom(5);
    },
    mounted:function(){
        var _this=this;
        UE.delEditor(_this.editorId); // 在调用初始化方法的时候，调用下del方法
        _this.ue_pb = UE.getEditor(_this.editorId, {//文本编辑器
            toolbars: [
                ['simpleupload',  'link', 'unlink', 'source', 'bold', //加粗
                    'indent', //首行缩进
                    'italic', //斜体
                    'underline', //下划线
                    'strikethrough',//删除线
                    'fontfamily', //字体
                    'fontsize', //字号
                    'paragraph', //段落格式
                    'justifyleft', //居左对齐
                    'justifyright', //居右对齐
                    'justifycenter', //居中对齐
                    'justifyjustify', //两端对齐
                    'forecolor', //字体颜色
                    'backcolor', //背景色
                    'inserttable', //插入表格
                    'deletetable', //删除表格
                ]
            ],
        });
        _this.ue_pb.addListener("ready", function () {
            _this.ue_pb_ready=true;
         });
        _this.ue_pb.addListener("contentChange", function () {  //contentChange 编辑器内容发生改变时会触发该事件
           _this.$emit('getEditorContent',_this.ue_pb.getContent());
        });
    },
    methods:{
        getRandom:function(num){
            var sum="";
            for(var i=0;i<num;i++){
                sum+=Math.floor(Math.random()*10);
            };
            return sum+"_editor";
        },//生成几位随机数
    },
}
</script>