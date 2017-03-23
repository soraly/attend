<template>
   <div class="header">
             <h3>this is demo</h3>
       <div>haha</div>
</div>
</template>
<script>
  export default {}
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
