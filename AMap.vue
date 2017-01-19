<template>
    <div :id="mapId" v-bind:style="mapStyle"></div>
</template>
<script>
export default{
    data:function(){
        return{
            mapStyle:{
                width:this.mapWidth +'px',
                height:this.mapHeight +'px'
            },
            addressData:{lng:0,lat:0,adcode:''},
        }
    },
    props:{
        //地图id
        mapId:{
            type:String,
            default:'allMap'
        },
        // 地图在该视图上的高度
        mapHeight:{
            type:Number,
            default:500
        },
        // 地图在该视图上的宽度
        mapWidth:{
            type:Number,
            default:500
        },
        //实际地址
        place:{
            type:String,
            default:''
        },
    },
    methods:{
        renderMap:function(address){
            var _self=this;            
            var map = new AMap.Map(_self.mapId, {
                resizeEnable: true,
                center: [120.133898, 30.266477],
                zoom: 13
            });

            var marker = new AMap.Marker({
                position: map.getCenter(),
                draggable: true,
                cursor: 'move',
                raiseOnDrag: true
            });
            var infoWindow = new AMap.InfoWindow({offset:new AMap.Pixel(0,-30)});
            AMap.plugin('AMap.Geocoder',function(){   //引入地址与经纬度插件
                var geocoder = new AMap.Geocoder();
                    geocoder.getLocation(address,function(status,result){    
                        if(status=='complete'&&result.geocodes.length){
                            marker.setPosition(result.geocodes[0].location);
                            map.setCenter(marker.getPosition());

                            marker.content=address;
                            marker.on('click',function(e){
                                infoWindow.setContent(e.target.content);
                                infoWindow.open(map, e.target.getPosition());
                            })
                      // console.log('坐标（经纬度）：'+result.geocodes[0].location+",区域编码："+result.geocodes[0].adcode)
                       _self.addressData.lng=result.geocodes[0].location.lng;
                        _self.addressData.lat=result.geocodes[0].location.lat;
                        _self.addressData.adcode=result.geocodes[0].adcode;
                        _self.$emit('getOutAmap',_self.addressData);    //输出经度、纬度、地理编码                        
                        }else{
                            alert('获取位置失败')
                        }
                    })
                });
 
           AMap.plugin(["AMap.ToolBar"],function(){               //引入缩放控制条
                    var tool = new AMap.ToolBar();
                    map.addControl(tool);   
                    });

           marker.setMap(map);     //初始化地图
           
        }
    },
    mounted:function(){
        this.renderMap(this.place);            
    },
    watch:{
        place:function(newValue){
            this.renderMap(newValue);
        },
    },    
}
</script>