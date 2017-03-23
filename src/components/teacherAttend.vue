<template>
  <div class="wrap" >
    <div class="tabs">
      <div class="tabs-flex">
          <a href="javascript:;" hidefocus="true" v-for="(item, key) in attendListData.countData" @click="attendListData.getData(item.key,key)"
           :class="{true:'active'}[item.key == attendListData.checked]">
          <span v-text="item.name"></span>
        </a>
      </div>
    </div>
    <div class="swiper-container" v-if="attendListData && attendListData.data && attendListData.data.count">
      <div class="content-slide">
        <ul class="clearfix">
          <li>打卡 <span v-text="attendListData.data.count.daycount"></span></li>
          <li><span v-text="{true:'迟',false:'早'}[attendListData.data.count.isLater]"></span><span v-text="attendListData.data.count.unusual"></span></li>
          <li>未打卡<span v-text="attendListData.data.count.absentcount"></span></li>
          <li>总共<span v-text="attendListData.sum"></span>人</li>
        </ul>
        <div class="content-table">
          <table width="100%" border="0" class="table table-hover">
            <tr v-for ="item in attendListData.data.list">
              <td width="22%"><a v-bind:href = " location + '?searchid='+ data.id +'&id='+item.id "> <span v-text="item.name"></span></a></td>
              <td width="50%">
                <a v-bind:href = "location + '?searchid='+ data.id +'&id='+item.id ">
                  <span v-text="item.attend.checktime"></span>
                </a>
              </td>
              <td width="28%">
                <a v-bind:href = "location + '?searchid='+ data.id +'&id='+item.id " >
                  <i class="state" v-bind:class="{0:'text-red',1:'text-red',4:'text-red',5:'text-red'}[item.attend.checkstatus]" v-text="{0:'缺勤',1:'未打卡',2:'正常考勤',3:'正常刷卡',4:'迟到',5:'早退',6:'请假',7:'旷课',8:'其他'}[item.attend.checkstatus]"></i>
                  <span class="arrow iconfont icon-right"> </span>
                </a>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div v-show="attendListData.list && attendListData.list.length==0 || showImg" class="no-data-box" >
      <img src="./../assets/img/none-inferior.gif" alt="">
    </div>
  </div>
</template>

<script>
  import utilities from '../common/utilities'
  import ajax from '../common/ajax'
  import $ from 'jquery'
  import $api from '../common/config'
  import Vue from 'vue'
  export default {
    props: ['searchData','xhrdata'],
    computed: {
      data: function () {
        return this.searchData
      },
      childdata: function () {
        return this.xhrdata
      }
    },
    data: function () {
      return {
        attendListData: {},
        showImg: false,
        location: location.origin + '/v1/attendance'
      }
    },
    methods: {
      init: function()  {
        var module = this;
        module.showImg = false;
        module.noop = function() {};
        ajax($api.yoAttend.total, this.childdata, function (result) {
          var timeArr = [];
          if(result.data && result.data.length == 0){
            module.attendListData = {}
          }else {
            module.attendListData =  result.data || {}
          }
          module.attendListData.list = module.attendListData.list || [];
          module.attendListData.count = module.attendListData.count || {};
          module.attendListData.sum = module.attendListData.count.sum  || 0;
          delete module.attendListData.count.sum;
          module.attendListData.list.forEach(function(item){
            item.atoms.length==0 && ( module.showImg = true );
            item.atoms.length && item.atoms.forEach(function(note){
              note.checktime = note.checktime? utilities.getTime(note.checktime*1000, 'HH:mm')  : '--:--';
            })
          });
          module.attendListData.countData=[];
          for(var key in module.attendListData.count ){
            var item = module.attendListData.count[key];
            item.key = key ;
            if( item.hasOwnProperty('latercount') ){
              item.unusual = item.latercount;
              item.isLater = true ;
            }else{
              item.unusual = item.earlycount;
              item.isLater = false;
            };
            timeArr.push(key);
            module.attendListData.countData.push(item);
          }
          module.bindSwipeEvent();

          Vue.set(module.attendListData,'checked',timeArr[0]);
          //切换选项卡更新数据
          module.attendListData.getData = function(key,index){
            var data = {list:[] };
            if(key){
              module.attendListData.checked = key;
              for(var attr in module.attendListData.count ){
                key == attr && (data.count = module.attendListData.count[attr]);
              }
              module.attendListData.list.forEach(function(item){
                item.atoms.forEach(function(sun)  {
                  sun.code == key &&  (item.attend = sun);
                },item.attend == null);
                data.list.push(item);
              });
              module.attendListData.data = data;
            }else{
              module.attendListData.data = {list:[],count: {} };
            };
            module.isMove(index);
          };
          module.attendListData.getData(module.attendListData.checked);
        })
      },
      gotoDetail: function (id) {
        this.$emit('detailEvent',id)
      },
      bindSwipeEvent: function (){
        var module = this;
      var tabNum = module.attendListData.countData ? module.attendListData.countData.length : 0,
        tabs = $(".tabs:first-child"),
        box = tabs.find(".tabs-flex"),
        TABWIDTH = 120,
        maxMove,
        nowNum = 0;
        module.isMove = tabs.width() < TABWIDTH*tabNum ? function (num){
        maxMove =  Math.ceil((TABWIDTH*tabNum - tabs.width())/TABWIDTH);
        nowNum = Math.min(Math.max(num-1,0),maxMove) ;
        box.animate({
          'marginLeft':-nowNum*TABWIDTH
        });
      }:module.noop;
    },
      getGradeid: function(classid){
        var id = 0, module = this;
        module.classes.length && module.classes.forEach(function(item){
          item.id == classid && (id = item.gradeid);
        });
        return id ;
  }
    },
    created: function (){
      this.init();
    } ,
    watch: {
      xhrdata: function (val) {
        this.childdata = val;
        this.init();
      }
    }
  }
</script>

<style scoped lang="less">
  td {
    padding: 8px;
    line-height: 2em;
    vertical-align: top;
    border-top: 1px solid #ddd;
  }
</style>
