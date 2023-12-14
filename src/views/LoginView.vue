<script>
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import axios from 'axios'
import '@/styles/login.css'

export default {
    setup(){
        
        const router = useRouter();

        let isShowMsgLoginSuccess = ref(false);
        let isShowMsgLoginFaild = ref(false);

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

        const login = async (data) =>{

            const response = await axios.post('http://127.0.0.1:8000/api/ScrumPro/members-login' , data);

            if(response.data.login){

                isShowMsgLoginSuccess.value = true;
                msgLoginSuccess.value = response.data.msg

                isShowMsgLoginFaild.value = false;

                localStorage.setItem('user-info' , JSON.stringify(response.data.user));
                localStorage.setItem('permissions' , JSON.stringify(response.data.permissions));

                setTimeout(() => {
                    if( response.data.user[0].role_name == 'product owner' ||
                        response.data.user[0].role_name == 'scrum master' ||
                        response.data.user[0].role_name == 'developer' ||
                        response.data.user[0].role_name == 'client'
                    ){
                        
                        router.push('/all-projects');

                    } else{
                        router.push('/dashboard');
                    }
                    isShowMsgLoginSuccess.value = false;
                    isShowMsgLoginFaild.value = false;
                }, 2500);

            } else{

                isShowMsgLoginFaild.value = true;
                msgLoginFaild.value = response.data.msg;

                isShowMsgLoginSuccess.value = false;

                localStorage.clear();

            }
        }

        return{
            isShowMsgLoginSuccess ,
            isShowMsgLoginFaild ,
            msgLoginSuccess ,
            msgLoginFaild ,
            formData ,
            login ,
            passwordToggleBtnText ,
            inputPasswordType ,
            toggleTypePassword
        }
    }
}
</script>

<template>
    <!-- Login Page -->
    <div class="login-page">
        <div class="description-section">
            <div class="container">
                <img src="https://img.freepik.com/premium-vector/illustration-cartoon-female-user-entering-login_241107-682.jpg"/>
            </div>
        </div>
        <div class="form-section">
            <section class="container">
                <router-link to="/home">
                    <h1> Scrum<span>Pro</span> </h1>
                </router-link>
                <form @submit.prevent="login(formData)">       
                    <div class="form-outline mb-4">
                        <label class="form-label" for="form1Example13">Email</label>
                        <input 
                            type="email" 
                            placeholder="Enter Email" 
                            id="form1Example13" 
                            class="form-control form-control-lg"
                            required
                            v-model="formData.email" 
                        />
                    </div>
            
                    <div class="form-outline mb-4">
                        <label class="form-label" for="form1Example23">Password</label>
                        <input 
                            :type="inputPasswordType" 
                            placeholder="Password" 
                            id="form1Example23" 
                            class="form-control form-control-lg"
                            required
                            v-model="formData.password" 
                        />
                        <i id="password-toggle-btn" @click="toggleTypePassword">
                            {{passwordToggleBtnText}}
                        </i>
                    </div>
        
                    <button type="submit" class="btn">Login</button>
                </form>
            </section>
        </div>
    </div>
    <!-- Login Page -->

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
.form-outline{
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
