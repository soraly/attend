<!-- 首页内容渲染 -->
<template>
  <div class="view-module-attendance main" :class="{'white-bg': params.router == 'studentDetail'||params.router == 'teacherDetail' }">
    <!-- 顶部 SELECT-->
    <selectComponent v-if="(params.router == 'total' || params.router == 'teacher')"  v-on:select-event="getSearchdata" :classData="classData"></selectComponent>

    
    <!-- total页面 -->
    <totalCountComponent  v-if = "params.router == 'total'"  :searchData="searchData"  ></totalCountComponent>

    <!--教师考勤-->
    <teacherAttend v-if="params.router == 'teacher'" :xhrdata="xhrdata" :searchData="searchData" ></teacherAttend>

    <!--学生考勤详情-->
    <studentDetail :studentid="studentid" v-if="params.router == 'studentDetail'"></studentDetail>

    <!--教师考勤详情-->
    <teacherDetail v-if="params.router == 'teacherDetail'"></teacherDetail>

  </div>
</template>
<script>
  import  './css/common.css'
  import $ from 'jquery'
  import myDatepicker from 'vue-datepicker'
  import selectComponent from './components/select.vue'
  import demoComponent from './components/demo.vue'
  import totalCountComponent from './components/totalcount.vue'
  import teacherAttend from './components/teacherAttend.vue'
  import studentDetail from './components/stuAttendDetail.vue'
  import teacherDetail from './components/teaAttendDetail.vue'
  import utilities from './common/utilities'
  import ajax from './common/ajax'
  import $api from './common/config'
  export default{
    data(){
      return{
        name: 'app',
        startTime: {
          time: ''
        },
        endtime: {
          time: ''
        },
        option: {
          type: 'day',
          week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
          month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          format: 'YYYY-MM-DD',
          placeholder: 'when?',
          inputStyle: {
            'display': 'inline-block',
            'padding': '6px',
            'line-height': '22px',
            'font-size': '16px',
            'border': '2px solid #fff',
            'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
            'border-radius': '2px',
            'color': '#5F5F5F'
          },
          color: {
            header: '#ccc',
            headerText: '#f00'
          },
          buttons: {
            ok: 'Ok',
            cancel: 'Cancel'
          },
          overlayOpacity: 0.5, // 0.5 as default
          dismissible: true // as true as default
        },
        timeoption: {
          type: 'min',
          week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
          month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          format: 'YYYY-MM-DD HH:mm'
        },
        multiOption: {
          type: 'multi-day',
          week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
          month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          format:"YYYY-MM-DD HH:mm"
        },
        limit: [{
          type: 'weekday',
          available: [1, 2, 3, 4, 5]
        },
          {
            type: 'fromto',
            from: '2016-02-01',
            to: '2016-02-20'
          }],

        isAdmin: '',
        classData: [],
        classes: '',
        params : {
          router: ''
        },
        xhrdata: '',
        searchData: {},
        attStudentId: '',
        schoolTotalList: [],
        schoolTeacherTotalList: [],
        msg:'Hello vue',
      }
    },
    methods: {
      //获取子组件数据
      getSearchdata: function (val) {
        this.searchData = val;
        this.changeClass();
      },
      init: function()  {
        var _this = this, module = this;
        module.hasAuth = !!(IGrow.user && IGrow.user.school && IGrow.user.school.people && IGrow.user.school.people.teacherid);
        _this.isAdmin = !!(IGrow.user && IGrow.user.school && IGrow.user.school.manager && IGrow.user.school.manager.master || IGrow.user.school.manager.admin);
        _this.isTeacher = !!(IGrow.user && IGrow.user.school && IGrow.user.school.people && IGrow.user.school.people.teacherid);
        module.noop = function(){};
        _this.teacherId = IGrow.user && IGrow.user.school && IGrow.user.school.people && IGrow.user.school.people.teacherid;
        _this.studentid = IGrow.user && IGrow.user.school && IGrow.user.school.people && IGrow.user.school.people.studentid;
        var params = utilities.params();
        if(module.studentid){
          module.params.router = 'studentDetail';
        }else if(params && params.searchid == 'allteacher' || (params && params.searchid == 'teachergroup')){
          module.params.router = 'teacherDetail'
        }else if(params && params.id) {
          module.params.router = 'studentDetail'
        }else {
          if(module.hasAuth){
            //教师
            module.searchData = {};
            module.loadRole().then(function(isAdmin){
              module.getClassList(module.isAdmin = isAdmin, function(){
                if(utilities.params() && utilities.params().classid){
                  var classid = utilities.params().classid;
                  _this.classes.forEach(function (item) {
                    if(item.id==classid){
                      _this.searchData = item;
                    }
                  })
                  module.$set(module.searchData, 'starttime',utilities.getTime(new Date().getTime(),'yyyy-MM-dd') )
                }else{
                  module.searchData = module.classes.length ? module.classes[0] : null;
                  module.$set(module.searchData, 'starttime',utilities.getTime(new Date().getTime(),'yyyy-MM-dd') )
                }
                module.changeClass();
              });
            })
          }
        }

      },

      //选择班级
      changeClass: function(){
        var module = this, data = module.searchData;
        if(data.id){
          module.classAttend();
          if(data.id == 'all'){
            module.params.router = 'total';
          }else if(data.id == 'allteacher' || data.name == '我的考勤'){
            module.params.router = 'teacher';
            module.getAttendanceList(data);
          }else if(data.id == 'teachergroup'){
            module.params.router = 'teacher';
            module.getAttendanceList(data);
          }else{
            data.classid = data.id;
            data.gradeid = module.getGradeid(data.classid);
            module.getAttendanceList(data);
            module.params.router = 'teacher';
          }
        } else{
          module.params.router = 'none';
        }
      },
      getGradeid: function(classid){
        var id = 0, module = this;
        module.classes.length && module.classes.forEach(function(item){
          item.id == classid && (id = item.gradeid);
        });
        return id ;
      },

      //班级考勤
      classAttend: function() {
        var module = this;
        module.getAttendanceList = function(data){
          if(data.name == '我的考勤'){
            module.xhrdata = $.extend({
              type : 'teacher',
              teacherid: module.teacherId? module.teacherId : '',
              _page : 1,
              endtime : data.starttime
            },data);
          }else if(data.id == 'teachergroup'){
            module.xhrdata = {
              _page : 1,
              _pagesize: 1000,
              status:0,
              type : 'teacher',
              teachergroupid: data.teachergroupid,
              starttime: data.starttime,
              endtime : data.starttime
            };
          }else{
            module.xhrdata = $.extend({
              type: data.id == 'allteacher' ? 'teacher' : 'student',
              _page: 1,
              endtime: data.starttime
            }, data);
          }

        };
      },

      //获取班级列表
      getClassList : function(isAdmin,callback) {
        var module = this, data = {
          _orderby: 'id asc',
          _fields: 'id,name,gradeid',
          _page: 1,
          _pagesize: 100
        };
        !isAdmin && (data.teacherid = module.teacherId);
        ajax($api[isAdmin ? 'schoolClass' : 'schoolTeacherClass'].list,data,function(ret){
          module.classes = ret.data || [];
          var isTeacher;
          module.roleType.forEach(function(item){
            if(['school.class.master', 'school.class.teacher', 'school.teacher'].indexOf(item.code) != -1){
              isTeacher = true;
            }
          });
          if(isTeacher){
            module.classes.push({id:'allteacher', name:'我的考勤'});
          }
          if (isAdmin)  {
            ajax($api.teacherAttendTime.list, {
              type: 1,
              _pagesize: 500
            },function (result) {
              result.data && result.data.length && result.data.forEach(function (item) {
                if (item.teachergroupid == 0) {
                  module.classes.unshift({
                    id: 'allteacher',
                    name: '全体教师'
                  })
                } else {
                  module.classes.push({
                    id: 'teachergroup',
                    teachergroupid: item.teachergroupid,
                    name: item.teachergroupname
                  });
                }
              });
              module.classes.unshift({id: 'all', name: '全校'});
              module.classData = module.classes;
              (callback || $.noop)();
            })
          } else {
            module.classData = module.classes;
            (callback || $.noop)();
          }
        },function(){
          module.classes = [];
          (callback || $.noop)();
        })
      },

      //权限控制
      loadRole: function(){
        var module = this;
        return new Promise(function(resolve,reject){
          module.roleType ? (defer.resolve()) : ajax($api.role.list,{ uid: IGrow.user.uid }, function(result){
            module.roleType = result.data || [];
            var isAdmin = false;
            module.roleType.forEach(function (item) {
              if (!isAdmin) {
                if (['school.admin', 'school.master', 'school.vice_master'].indexOf(item.code) != -1) {
                  isAdmin = true;
                }
              }
            });
            resolve(isAdmin);
          }, function(error){
            reject(error);
          })
        })
      }
    },
    created: function(){
      var _this = this;
      console.log('start')
      utilities.basicData().then(function(){
        var roles = {}, manager={};
        window.IGrow.user.roles && window.IGrow.user.roles.forEach(function(item){
          manager[item.code.replace('school.', '')] = true
          roles[item.code] = true;
        })
        window.IGrow.user.school.manager = manager;
        window.IGrow.user.roles = roles;
        _this.init()
      })

    },
    components:{
      'date-picker': myDatepicker,
      selectComponent,
      demoComponent,
      teacherAttend,
      studentDetail,
      teacherDetail,
      totalCountComponent
    }
  }
</script>
<style  lang="less">
  body, a, img, button, input, i, div, li, textarea {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .main {

    position: absolute;
    background: #f4f4f4;
    min-height: 100%;
    width: 100%;
  }
  .white-bg {
    background: #fff;
  }
  .total-count {
    margin:0 30px;
  }
  .view-module-attendance {
  ul, li {
    margin: 0;
    padding: 0;
  }
  .one-wrapper {
    padding-top: 40px;
  }
  .header {
    padding: 14px 0;
    background-color: #4ac8d6;
    position: relative;

  .input-append {

  .date-input {
    background: none;
    border: none;
    width: 0;
    cursor: pointer;
    z-index: 2;
  }
  span i {
    font-size: 26px;
    margin: 5px 0 0 0;
  }
  }
  }
  .input-append .add-on i {
    color: #ffffff;
    font-size: 24px;
    top: 7px;
  }
  .wrapper {
    margin: 0 30px;
  }
  .Two-time-periods {
    position: absolute;
    top: 50%;
    margin: -161px 2rem;
    width: 90%;

  }
  .totle-title {
    margin: 15px 0 10px 0;
  }
  .box {
    border: 1px solid #d0d0d0;
    border-bottom: none;
    border-radius: 3px;
    background: #fff;
    margin: 0 auto;
  li {
    position: relative;
    border-bottom: 1px solid #d0d0d0;
    padding: 40px 0;
  h3 {
    width: 56px;
    height: 56px;
    border: 1px solid #d0d0d0;
    border-radius: 50%;
    position: absolute;
    top: -24px;
    left: 50%;
    margin-left: -28px;
    background: #fff;
    font-size: 14px;
  span {
    display: block;
    width: 30px;
    margin: 12px auto 0;
    line-height: 16px;
  &.text-more {
     width: 40px;
     font-size: 13px;
     text-align: center;
   }
  }
  }
  table {
    width: 98%;
  tr td {
    padding: 5px 0 5px 6%;
  i {
    display: inline-block;
    width: 50px;
  }
  span {
    display: inline-block;
    background: #48c8d6;
    color: #fff;
    padding: 0 8px;
    min-width: 60px;
  }
  }
  }
  }
  }
  .text-red {
    color: #c00;
  }
  .tabs {
    width: 100%;
    overflow: hidden;
  .tabs-flex {
    display: table;
    margin: 0 auto;
  }
  a {
    display: table-cell;
    min-width: 120px;
    color: #333;
    text-align: center;
    line-height: 35px;
    font-size: 14px;
    text-decoration: none;
  &.active {
     color: #40acb8;
     border-bottom: 2px solid #40acb8;
   }
  }
  }
  .state {
    display: inline-block;
    min-width: 50px;
    text-align: right;
    float: left;
  }
  .swiper-container {
    width: 100%;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }
  .content-slide {
  ul li {
    float: left;
    width: 25%;
    text-align: center;
    padding: 8px 0;
    background: #394345;
    color: #fff;
    min-height: 36px;
  }
  table {
  tr {
  td {
    text-align: center;
    line-height: 2em;
  a {
    display: block;
    color: #333;
  }
  }
  &:nth-child(even) {
     background-color: #f4f4f4;
   }
  }
  }
  }
  /*学生考勤记录*/
  .allTranslation() {
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s   ease;
  }
  .studentList {
    background-color: #fff;
    min-height: 100%;
    width: 100%;
    position: absolute;
  }
  .page-content {
    padding-top: 3rem;
  &.hasLength {
     position: absolute;
     min-height: 100%;
     width: 100%;
     background: url(assets/img/line.png) #fff 63px 30px repeat-y;
     background-clip: content-box;
   }
  }
  .record_list {
    width: 100%;
    margin-left: 0px;
    padding-bottom: 10px;
    position: relative;
  &:first-child::before {
     display: block;
     content: ".";
     position: absolute;
     top: 0;
     left: 0;
     width: 80px;
     height: 35%;
     color: #fff;
     background-color: #fff;
   }
  dt {
    width: 80px;
    font-size: 0.9em;
    color: #333;
    line-height: .9em;
    display: block;
    position: absolute;
    top: 35%;
    background-color: #fff;
  span {
    display: inline-block;
    width: 56px;
    padding-right: 10px;
    text-align: right;
    font-weight: normal;
  }
  i {
    color: #d6d6d6;
    font-weight:normal;
  }
  .allTranslation();
  }
  dd {
    padding: 15px;
    margin: 0 0 0 80px;
    background: #f3f3f3;
    border-radius: 30px 0px 0px 30px;
  .allTranslation();
  .detail-list {
    margin-bottom: 5px;
  p {
  &:last-child {
     margin-bottom: 0;
   }
  }
  i {
    color: #b6b6b6;
  }
  .time {
    display: inline-block;
    min-width: 45px;
    height: 18px;
    line-height: 18px;
    padding: 0 0 0 5px;
  }
  .pic {
    padding: 8px 0 8px 0;
  }
  img {
    max-width: 180px;
    margin-left: 23px;
  }
  }

  }

  &.current {
  dt {
  i {
    color: #4ac8d6;
  }
  }
  dd {
    background: #4ac8d6;
  i {
    color: #fff;
  }
  }
  }
  }
  .loadingMore {
    text-align: center;
    padding: 1rem 0;
  }
  }
</style>
