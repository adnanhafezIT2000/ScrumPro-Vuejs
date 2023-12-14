<script>
import axios from 'axios'
import { onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/styles/admin-login.css'

export default {
    setup() {
        
        const router = useRouter();

        let isShowMsgLoginFaild   = ref(false);
        let isShowMsgLoginSuccess = ref(false);

        let msgLoginFaild = ref('');
        let msgLoginSuccess = ref('');

        let passwordToggleBtnText = ref('hide');
        let inputPasswordType = ref('password');

        const toggleTypePassword = ()=>{

            if(passwordToggleBtnText.value == 'hide'){

                inputPasswordType.value = 'text';
                passwordToggleBtnText.value = 'show';

            } else{

                inputPasswordType.value = 'password';
                passwordToggleBtnText.value = 'hide';
            }
        }

        let formData = reactive({
            "email": '' ,
            "password": ''            
        });

        onBeforeMount(()=>{

            let userInfo = JSON.parse(localStorage.getItem('user-info'));
            if( userInfo ){router.push('/dashboard');}
        });

        const login = async (data) =>{

            const response = await axios.post('http://127.0.0.1:8000/api/ScrumPro/admin-login' , data);

            if(response.data.login){

                isShowMsgLoginSuccess.value = true;
                msgLoginSuccess.value = response.data.msg

                isShowMsgLoginFaild.value = false;

                localStorage.setItem('user-info' , JSON.stringify(response.data.user));
                localStorage.setItem('permissions' , JSON.stringify(response.data.permissions));

                setTimeout(() => {
                    router.push('/dashboard');
                    isShowMsgLoginSuccess.value = false;
                    isShowMsgLoginFaild.value = false;
                }, 2500);

            } else{

                isShowMsgLoginFaild.value = true;
                msgLoginFaild.value = response.data.msg;

                isShowMsgLoginSuccess.value = false;

                localStorage.clear();

            }
        };

        return{
            isShowMsgLoginFaild ,
            isShowMsgLoginSuccess ,
            msgLoginFaild ,
            msgLoginSuccess ,
            formData ,
            login ,
            passwordToggleBtnText ,
            inputPasswordType ,
            toggleTypePassword
        }
    },
}
</script>

<template>
    <!-- Admin Login Page -->
    <div class="admin-login-page">
        <div class="admin-login-box shadow">
            <div class="logo">
                <h1> Scrum<span>Pro</span> </h1>
            </div>
            <form @submit.prevent="login(formData)">
                <div class="form-group">
                    <label for="exampleInputEmail1">Email</label>
                    <input 
                        type="email" 
                        class="form-control form-control-lg" 
                        id="exampleInputEmail1" 
                        aria-describedby="emailHelp" 
                        placeholder="Enter email"
                        v-model="formData.email"
                        required
                    >
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input 
                        :type="inputPasswordType"  
                        class="form-control form-control-lg" 
                        id="exampleInputPassword1" 
                        placeholder="Enter password"
                        v-model="formData.password"
                        required
                    >
                    <i id="password-toggle-btn" @click="toggleTypePassword">
                        {{passwordToggleBtnText}}
                    </i>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
             </form>
        </div>
    </div>
    <!-- Admin Login Page -->

    <!-- Login Success -->
    <div id="alert-success" v-if="isShowMsgLoginSuccess">
        <i class="fa fa-check"> </i>
        <p>
            {{msgLoginSuccess}}
        </p>
    </div>
    <!-- Login Success -->

    <!-- Login Faild -->
    <div id="alert-danger" v-if="isShowMsgLoginFaild">
        <i class="fa fa-exclamation"> </i>
        <p>
            {{msgLoginFaild}}
        </p>
    </div>
    <!-- Login Faild -->
</template>

<style scoped>
.form-group{
    position: relative;
}
#password-toggle-btn{
    position: absolute;
    top: 70%;
    transform: translateY(-50%);
    right: 20px;
    font-size: 18px;
    color: var(--main-color);
    cursor: pointer;
    text-transform:capitalize;
    user-select: none;
}
</style>
