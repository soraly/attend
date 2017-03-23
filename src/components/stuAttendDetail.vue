<template>
  <div class="page-content" :class="{'hasLength': studentAttendList.length }"  >
    <dl class="record_list" :class="{true:'current'}[key==0]" v-for=" (item,key) in studentAttendList"  >
      <dt> <span class="txt" v-text="item.date"></span><i class="iconfont icon-record"></i> </dt>
      <dd>
        <div v-for="note in item.attendList" class="detail-list">
          <p  :class="{0:'text-red',1:'text-red',4:'text-red',5:'text-red'}[note.checkstatus]"><i class="iconfont icon-time"></i><span class="time" >{{note.checktime}}</span> <span v-text="note.name"></span> </p>
          <div class="pic" v-if="note.webiconpath"><img class="img" v-bind:src="note.webiconpath"></div>
        </div>
      </dd>
    </dl>
    <div class="no-data-box " v-show="showImg &&  studentAttendList.length == 0">
      <img src="./../assets/img/none-inferior.gif" alt="">
    </div>
  </div>
</template>
<style scoped lang="less">
  body {
    font-size: 14px;
    .page-content {
      padding-top: 30px;
    }
  }
  .page-content {
    background: white;
  }
  p{
      font-size: 14px;
      text-align: left;
    }
  .record_list {
    margin-bottom: 20px;
  }
</style>
<script>
  import utilities from '../common/utilities'
  import ajax from '../common/ajax'
  import $ from 'jquery'
  import $api from '../common/config'
    export default{
        props: ['studentid'],
        data(){
            return{
                msg:'hello vue',
                isLoading: false,
                overplus: 2,
                showImg: false,
                endTime: new Date().getTime(),
                startTime: '',
                ONEDAY: 60*60*24*1000,
                studentAttendList: []
            }
        },
        created: function () {
            this.startTime = this.endTime - 9*this.ONEDAY;
            var module = this, params =utilities.params() ,
              studentid = params && params.id || this.studentid ,
              data = {
                type : 'student',
                studentid : studentid,
                schoolid: IGrow.school.id,
                startday : utilities.getTime(this.startTime,'yyyy-MM-dd'),
                endday : utilities.getTime(this.endTime,'yyyy-MM-dd'),
                _relatedfields :'code.name,student.name'
              };
              this.loadAttend(data);
              this.scroll();
        },
        methods: {
          loadAttend: function (data){
            var module = this;
              ajax($api.yoAttend.studentDetail,data,function (result) {
              var data = result.data || [],attendids = [];
              data.length && (document.title = data[0].student.name + "考勤记录");
              data.length && data.forEach(function(item){
                item.checktime = item.checktime? utilities.getTime(item.checktime*1000, 'HH:mm'):'--:--';
                item.date = item.day.toString().slice(4).replace(/(^\d{2})/g,"$1"+"-");
                var obj ={
                  name : item.code.name,
                  createtime : item.createtime,
                  checktime : item.checktime,
                  checkstatus : item.checkstatus,
                  webiconpath : item.webiconpath
                };
                !module.studentAttendList && (module.studentAttendList = []);
                if(!~attendids.indexOf(item.attendid)){
                  attendids.push(item.attendid);
                  item.attendList = [];
                  item.attendList.push(obj);
                  module.studentAttendList.push(item);
                }else{
                  module.studentAttendList.forEach(function(note) {
                    note.attendid == item.attendid && note.attendList.push(obj)
                  });
                }
                for(var i = 0; i<module.studentAttendList.length; i++){
                  for(var j = i + 1; j < module.studentAttendList.length; j++){
                    if(module.studentAttendList[i].day<module.studentAttendList[j].day){
                      var temp = module.studentAttendList[j];
                      module.studentAttendList[j] = module.studentAttendList[i];
                      module.studentAttendList[i] = temp;
                    }
                  }
                }
              });
              if(module.overplus == 0){
                if(module.studentAttendList.length==0){
                  module.showImg = true;
                }
              }
              module.studentAttendList && module.studentAttendList.length<6 && setTimeout(function(){
                  module.loadMore(200)
              },0);
              module.isLoading = false;
            })
          },
          scroll: function(){
            var module = this;
            function testScrollHeight (scrollTop,num,nowTop){
              var dl = $(".record_list");
              num = num || 0;
              nowTop = nowTop || 0;
              if(nowTop < scrollTop && num < dl.length){
                nowTop +=  dl.eq(num).outerHeight(true);
                num ++;
                return testScrollHeight.apply(this,[scrollTop,num,nowTop]);
              }else{
                return num ;
              }
            };
            $(window).scroll(function(){
              var num = testScrollHeight($(this).scrollTop(),0,0),
                totalNum = module.studentAttendList ? module.studentAttendList.length:0;
              $(".record_list").removeClass("current").eq(num).addClass("current");
              if(totalNum<=6 || num > totalNum-6){
                module.loadMore()
              }
            });
          },
          loadMore: function(){
              if(!this.isLoading && this.overplus > 0){
                var params = utilities.params();
                var data = {
                  type : 'student',
                  schoolid: IGrow.school.id,
                  studentid : params && params.id || this.studentid ,
                  _relatedfields :'code.name,student.name'
                };
                this.endTime = this.startTime - this.ONEDAY ;
                this.startTime = this.endTime - 9*this.ONEDAY;
                this.overplus-- ;
                this.isLoading = true ;
                data.startday = utilities.getTime(this.startTime,'yyyy-MM-dd');
                data.endday = utilities.getTime(this.endTime,'yyyy-MM-dd');
                this.loadAttend(data);
              }
          }
        }
    }
</script>
