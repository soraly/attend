<template>
   <div class="header">
             <div class="input-append">
               <div class="date-contain">
                 <span class="add-on"><i class="iconfont icon-calendar"></i></span>
                 <b>{{day}}</b>
               </div>
               <date-picker field="myDate"
                            placeholder="选择日期"
                            v-model="date"
                            format="yyyy-mm-dd"
                            :forward="false"></date-picker>
             </div>
            <div  class="input-class">
                <select class="modelClassid" v-on:change="changeClass" v-model="searchData">
                    <option v-for="option in classData" v-bind:value="option">{{option.name}}</option>
                </select>
            </div>

</div>
</template>
<script>
  import '../css/datetimepicker.min.css'
  import  $ from 'jquery'
  import myDatepicker from 'vue-datepicker-simple/datepicker-2.vue'; //引入对应的组件
  import utilities from '../common/utilities'
  export default {
    props: ['classData'],
    data: function () {
      return {
        date: utilities.getTime(new Date().getTime(),'yyyy-MM-dd'),
        searchData: '',
        starttime: '',
        day: '',
        testdata: []
      }
    },
    components: {
      'date-picker': myDatepicker,
    },
    computed: {
      childClassData: function () {
          return  this.classData
      }
    },
    watch: {
      date: function (val) {
        var _this = this;
        _this.day = val.split('-');
        _this.day.shift();
        _this.day = _this.day[0]+'月'+_this.day[1]+'日';
        _this.$set(_this.searchData,'starttime',val);
        this.$emit('select-event', _this.searchData);
      }
    },
    methods: {
      changeClass: function () {
        var _this = this;
        _this.$set(_this.searchData, 'starttime', _this.date);
        this.$emit('select-event',_this.searchData);
      }
    },
      mounted: function () {
      var _this = this;
        $('#myDate').attr('readonly', 'readonly');
        if(!this.searchData){
          this.searchData = this.childClassData.length && this.childClassData[0] || {}
          if(utilities.params() &&  utilities.params().classid){
            var classid = utilities.params().classid;
            _this.childClassData.forEach(function (item) {
              if(item.id==classid){
                _this.searchData = item;
              }
            })
          }
        }
        _this.day = utilities.getTime(new Date().getTime(),'MM月dd日  ')
    }
  }
</script>
<style lang='less'>

.vue-datepicker .vue-datepicker-panels {
  width: 260px !important;
}
    .header {
    padding: 14px 0;
    background-color: #4ac8d6;
    position: relative;
    .input-class {
      position: relative;
      z-index: 3;
      margin-right:100px;
      text-align: center;
      margin-top: -30px;
      .modelClassid {
        width: 90%;
        height: 32px;
        border: 0;
        border-radius: 2px;
        display: inline-block;
        -moz-appearance: none;
        -webkit-appearance: none;
        background: #fff url(../assets/img/arrow8.png) no-repeat 97% center;
      }
    }

    .input-append {
    #myDate {
      width: 90px;
    }
    .vue-datepicker {
      top: 20px;
      position: absolute;
      input {
        opacity: 0;
      }
    .vue-datepicker-panels {
      position: fixed;
      right: 0px;
      left: auto;
      top: 49px;
    }
    }
      .date-contain {
        background: white;
        b {
          border-left: 1px solid #4ac8d6;
          position: relative;
          top: -3px;
          padding-left: 2px;
        }
        i {
          color: #4ac8d6;
        }
      }
      display: block;
      margin-left: auto;
      width: 97px;
      margin-right: 10px;
      /*position: relative;*/
      margin-top: 5px;
      .date-picker {
        position: absolute;
        width: 100px;
        height: 30px;
        z-index: 999;
      }
      .input {
        opacity: 0;
        line-height: normal;
      }
      .date-input {
        background: none;
        border: none;
        /*width: 0;*/
        cursor: pointer;
        z-index: 2;
      }
      span i {
        color: #fff;
        font-size: 26px;
        margin: 5px 0 0 0;
      }
    }
  }
</style>
