<template>
  <div>
    <div class="login-container">
      <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <div class="title-container">
          <h3 class="title" :style="isAdmin?'color:#E6A23C':''">{{ITEM_NAME}}</h3>
          <!-- <lang-select class="set-language"></lang-select> -->
        </div>
        
        <el-form-item prop="username">
          <span class="svg-container svg-container_login">
            <svg-icon icon-class="user" />
          </span>
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="账号" />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>

        <!-- <div class="forget-password" v-if="SMS_close=='1'" @click="centerDialogVisible = true">忘记密码</div> -->
        <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>

      </el-form>
    </div>

    <copyRight :obj='copyRightConfig'></copyRight>

    <el-dialog title="重置密码" :visible.sync="centerDialogVisible" width="30%" center>
        <el-form :model="findForm">
          <el-form-item label="账号手机号" label-width="90px">
            <el-input type='text' v-model="findForm.phone" autoComplete="on" placeholder="账号" />
          </el-form-item>
          <div class="codebox">
            <el-form-item label="验证码" label-width="90px">
              <el-input v-model="findForm.code" autoComplete="on" placeholder="验证码" />
            </el-form-item>
            <el-button type="primary" style="width:30%;height:36px;margin-left:10px" @click="sendCode">{{codetimeShow?codetime+'秒后获取':'获取验证码'}}</el-button>
          </div>
          <el-form-item label="输入新密码" label-width="90px">
            <el-input v-model="findForm.password1" type='password' autoComplete="on" placeholder="新密码" />
          </el-form-item>
          <el-form-item label="确认新密码" label-width="90px">
            <el-input v-model="findForm.password2" type='password' autoComplete="on" placeholder="确认密码" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="resetPassword">确 定</el-button>
        </div>
      </el-dialog>
  </div>  
</template>

<script>
import vd from "@/utils/validate";
import { getToken, setToken, removeToken, setUser, setRoles, } from "@/utils/auth";
import LangSelect from "@/components/LangSelect";
import loginApi from "@/api/login";
import copyRight from '@/components/copyRight';

export default {
  components: { 
    LangSelect,
    copyRight,
  },

  data() {
    const validateUsername = (rule, value, callback) => {
      vd.isEmpty(value) ? callback(new Error("请输入账号!")) : callback();
    };
    const validatePassword = (rule, value, callback) => {
      value.length < 6 ? callback(new Error("密码不能少于6位")) : callback();
    };
    return {
      ITEM_NAME: process.env.ITEM_NAME,

      isAdmin: false, //控制平台和商家角色
      tabRole: "",

      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",

      loading: false,
      centerDialogVisible: false,
      formLabelWidth: "120px",
      findForm: {
        phone: "",
        code: "",
        password1: "",
        password2: ""
      },
      codetimeShow: false,
      codetime: 60,
      SMS_close: process.env.SMS_close,

      copyRightConfig: {
        year: 2019,
        company: '武汉科技有限公司',
        province: '鄂',
        record: '42010202002228',
      },
    };
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    /**
     * 获取验证码
     */
    sendCode() {
      if (!this.codetimeShow) {
        let phoneReg = /^[1][0-9][0-9]{9}$/;
        if (this.findForm.phone == "") {
          return this.$message("请输入手机号");
        }
        if (!phoneReg.test(this.findForm.phone)) {
          return this.$message("请输入正确手机号");
        }
        getVerificationCode({ mobile: this.findForm.phone,type: 2 }).then(response => {
        });
        let that = this;
        that.codetimeShow = true;
        let interval = setInterval(() => {
          if (that.codetime-- <= 0) {
            that.codetime = 60;
            that.codetimeShow = false;
            clearInterval(interval);
          }
        }, 1000);
      }
    },
    /**
     * 重置密码
     */
    resetPassword() {
      if (this.findForm.phone == "") {
        return this.$message("请输入手机号");
      } else if (this.findForm.code == "") {
        return this.$message("请输入短信验证码");
      } else if (this.findForm.password1 == "") {
        return this.$message("请输入密码");
      } else if (this.findForm.password2 == "") {
        return this.$message("请确认密码");
      } else if (this.findForm.password1 != this.findForm.password2) {
        return this.$message("两次密码不一致");
      }
      resetPassword({
        mobile: this.findForm.phone,
        code: this.findForm.code,
        password: this.findForm.password2
      }).then(response => {
        if(response.status == 0){
          this.centerDialogVisible = false
        }else {
          this.$message(response.error);
        }
      });
    },

    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true;

          let param = {
                seller_name: this.loginForm.username,
                seller_password: this.loginForm.password,
              };

          let res = await loginApi.login(param);

          if(res && res.status === 0) {
            let token = res.data.token;
            this.$store.commit("SET_TOKEN", token);
            setToken(token);

            let roles = res.data.permission || [];
            if(res.data.is_seller == "1") {
              roles.push("seller");
            } else {
              roles.push("seller2");
            }
            setRoles(JSON.stringify(roles));
            
            return this.$store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
              this.$router.addRoutes(this.$store.state.permission.addRouters) // 动态添加可访问路由表
              this.$store.dispatch('addRoute').then(() => {
                this.$router.push({ path: "/" });
              });
            });

          }

          return this.$message.error(res ? res.error || res : '登录接口失败!')
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    
  },
  created() {
  },
  destroyed() {
  }
};
</script>

<style lang="css">
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: #2d3a4b;
}
.login-container .el-input {
  display: inline-block;
  height: 47px;
  width: 85%;
}
.login-container .el-input input {
  background: transparent;
  border: 0px;
  -webkit-appearance: none;
  border-radius: 0px;
  padding: 12px 5px 12px 15px;
  color: #eee;
  height: 47px;
  
}
.login-container .el-input input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px #2d3a4b inset !important;
  -webkit-text-fill-color: #fff !important;
}

.login-container .el-form-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
}

.codebox {
  display: flex;
}
</style>

<style lang="css" scoped>
.login-container {
  
}
.login-form {
  position: absolute;
  left: 0;
  right: 0;
  width: 520px;
  padding: 35px 35px 15px 35px;
  margin: 120px auto;
}
.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;
}
.tips span:first-of-type {
  margin-right: 16px;
}

.svg-container {
  padding: 5px 5px 5px 10px;
  color: #889aa4;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
  
}
.svg-container_login {
  font-size: 18px;
}

.title-container {
  position: relative;
  
}
.title-container .title {
  font-size: 26px;
  font-weight: 400;
  color: #eee;
  margin: 0px auto 40px auto;
  text-align: center;
  font-weight: bold;
}
.title-container .set-language {
  color: #fff;
  position: absolute;
  top: 5px;
  right: 0px;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
.thirdparty-button {
  position: absolute;
  right: 35px;
  bottom: 28px;
}

.forget-password {
  font-size: 10px;
  color: #ffffff;
  text-align: right;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
