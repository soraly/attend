<template>
  <div class="wrapper view-module-attendance total-count " >
      <div class="totle-title"  v-if="schoolTotalList.length">全部学生</div>
    <ul class="box" v-if="schoolTotalList.length">
      <li v-for="item in schoolTotalList">
        <h3><span v-text="item.name" :class="item.name.length>4 && 'text-more'"></span></h3>
        <table>
          <tr>
            <td><i>打卡</i><span>{{ item.daycount }}人</span></td>
            <td><i>未打卡</i><span>{{item.notpunch}}人</span></td>
          </tr>
          <tr>
            <td><i v-text="{true:'迟到',false:'早退'}[item.hasLater]"> </i><span>{{ {true:item.latercount,false:item.earlycount}[item.hasLater] }}人</span></td>
            <td><i>总共</i><span>{{item.count}}人</span></td>
          </tr>
        </table>
      </li>
    </ul>
    <div class="totle-title"  v-if="schoolTeacherTotalList.length">全部教师</div>
    <ul class="box" v-if="schoolTeacherTotalList.length">
      <li v-for="item in schoolTeacherTotalList">
        <h3><span v-text="item.name" :class="item.name.length>4 && 'text-more'"></span></h3>
        <table>
          <tr>
            <td><i>打卡</i><span>{{ item.daycount }}人</span></td>
            <td><i>未打卡</i><span>{{item.notpunch}}人</span></td>
          </tr>
          <tr>
            <td><i v-text="{true:'迟到',false:'早退'}[item.hasLater]"> </i><span>{{ {true:item.latercount,false:item.earlycount}[item.hasLater] }}人</span></td>
            <td><i>总共</i><span>{{item.count}}人</span></td>
          </tr>
        </table>
      </li>
    </ul>
    <div class="no-data-box" v-if="showImg ">
      <img src="../assets/img/none-inferior.gif" alt="">
    </div>
  </div>
</template>

<script>
  import utilities from '../common/utilities'
  import ajax from '../common/ajax'
  import $ from 'jquery'
  import $api from '../common/config'
    export default{
        props: ['searchData'],
        computed: {
          childSearch: function () {
            return this.searchData
          }
        },
        data(){
            return{
              schoolTeacherTotalList: [],
              schoolTotalList: [],
              temp: this.searchData,
              showImg: false
            }
        },
        methods: {
          getSchoolTotal :function(data){
            var module = this;
            module.schoolTotalListArr = [];
            module.schoolTeacherTotalListArr = [];
            return new Promise(function (resolve, reject) {
              ajax($api.yoAttend.schooltotal, data, function (result) {
                if(data.type=='student'){
                  module.schoolTotalList = result.data || {};
                  for(var name in module.schoolTotalList){
                    var item = module.schoolTotalList[name];
                    item.hasLater = item.hasOwnProperty('latercount') ? true:false;
                    module.schoolTotalListArr.push(item);
                  }
                  module.schoolTotalList = module.schoolTotalListArr;
                  module.studentTotle="全部学生";
                }else {
                  module.schoolTeacherTotalList = result.data || [];
                  for(var name in module.schoolTeacherTotalList){
                    var item = module.schoolTeacherTotalList[name];
                    item.hasLater = item.hasOwnProperty('latercount') ? true:false;
                    module.schoolTeacherTotalListArr.push(item);
                  }
                  module.schoolTeacherTotalList = module.schoolTeacherTotalListArr;
                  module.teacherTotle="全部教师";
                }
                resolve()
              },function (errot) {
                module.showImg =true;
                reject()
              })
            })
          },
        },
        watch: {
          'childSearch.starttime': function () {
            var module = this, nowDate = utilities.getTime(new Date().getTime(),'yyyy-MM-dd');
            module.showImg = false;
            module.getSchoolTotal({
              type : 'student',
              starttime : module.childSearch.starttime || nowDate,
              endtime : module.childSearch.starttime || nowDate
            }).then(function () {
                module.getSchoolTotal({
                type : 'teacher',
                starttime : module.childSearch.starttime || nowDate,
                endtime : module.childSearch.starttime || nowDate
              })
            }).then(function () {
              if(module.schoolTotalList.length==0 && module.schoolTeacherTotalList.length==0){
                module.showImg = true;
              }
            })
          }
        },
        created: function () {
          var module = this, nowDate = utilities.getTime(new Date().getTime(),'yyyy-MM-dd');
           module.showImg = false;
           module.getSchoolTotal({
            type : 'student',
            starttime : module.childSearch.starttime || nowDate,
            endtime : module.childSearch.starttime || nowDate
          }).then(function () {
             module.getSchoolTotal({
               type : 'teacher',
               starttime : module.childSearch.starttime || nowDate,
               endtime : module.childSearch.starttime || nowDate
             }).then(function () {
               if(module.schoolTotalList.length==0 && module.schoolTeacherTotalList.length==0){
                 module.showImg = true;
               }
             });
           })
        },
        components:{

        }
    }
</script>


