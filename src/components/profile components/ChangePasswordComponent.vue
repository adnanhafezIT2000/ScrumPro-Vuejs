<script>
import { reactive, ref } from 'vue'
import axios from 'axios';

export default {
    setup() {

        const userInfo = JSON.parse(localStorage.getItem('user-info'));

        let isShowFormEnterNewPassword = ref(false); 

        let isShowMsgVerifySuccess = ref(false);
        let isShowMsgVerifyFaild = ref(false);
        let isShowMsgPasswordsNotMatch = ref(false);
        let isShowMsgChangePasswordSuccess = ref(false);

        let currentPassword = ref('');

        let formDataEnterNewPassword = reactive({
            "id": userInfo[0].id ,
            "newPassword": '' ,
            "confirmNewPassword": ''
        });

        /* Function Verify Password */
        const verifyPassword = (CurrentPassword) =>{

            if( CurrentPassword === userInfo[0].password ){

                isShowMsgVerifySuccess.value = true;
                isShowMsgVerifyFaild.value = false;

                isShowFormEnterNewPassword.value = true;

                setTimeout(() => {  
                    isShowMsgVerifySuccess.value = false;
                }, 2500);

            } else {

                currentPassword.value = '';
                isShowMsgVerifyFaild.value = true;
                isShowMsgVerifySuccess.value = false;
                setTimeout(() => {  
                    isShowMsgVerifyFaild.value = false;
                }, 3500);
            }
        }

        /* Call Change Password API */
        const changePassword = async (data) =>{

            if(data.newPassword !== data.confirmNewPassword){

                isShowMsgPasswordsNotMatch.value = true;
                setTimeout(() => {
                    isShowMsgPasswordsNotMatch.value = false;
                }, 3500);

                formDataEnterNewPassword.newPassword = '';
                formDataEnterNewPassword.confirmNewPassword = '';

            } else if(data.newPassword === data.confirmNewPassword){

                await axios.post('http://127.0.0.1:8000/api/ScrumPro/change-password' , data);

                isShowMsgChangePasswordSuccess.value = true;
                isShowMsgPasswordsNotMatch.value = false;

                currentPassword.value = '';
                formDataEnterNewPassword.newPassword = '';
                formDataEnterNewPassword.confirmNewPassword = '';
                isShowFormEnterNewPassword.value = false;

                setTimeout(() => {
                    isShowMsgChangePasswordSuccess.value = false;
                }, 2500);
            }
        }

        return{
            isShowFormEnterNewPassword ,
            isShowMsgVerifySuccess ,
            isShowMsgVerifyFaild ,
            verifyPassword ,
            currentPassword ,
            formDataEnterNewPassword ,
            changePassword ,
            isShowMsgPasswordsNotMatch ,
            isShowMsgChangePasswordSuccess
        }
    },
}
</script>

<template>
    <div id="profile-change-password-user">
        <!-- Verify Current Password -->
        <div class="verify-current-password">
            <h5> verify current password </h5>
            <div class="form-group">
                <input 
                    type="password" 
                    class="form-control" 
                    id="inputVerifyPassword"
                    placeholder="Enter current password"
                    v-model="currentPassword"
                    :disabled="isShowFormEnterNewPassword"
                >
            </div>
            <button 
                type="button" 
                @click="verifyPassword(currentPassword)" 
                class="btn"
                id="verifybutton"
                :disabled="isShowFormEnterNewPassword"
            > 
                verify 
            </button>
        </div>
        <!-- Verify Current Password -->

        <!-- Enter New Password -->
        <form 
            @submit.prevent="changePassword(formDataEnterNewPassword)" 
            v-if="isShowFormEnterNewPassword"
        >
            <div class="enter-new-password">
                <h5> enter new password </h5>  
                <div class="verify-current-password">
                    <div class="form-group">
                        <input 
                            type="password" 
                            class="form-control" 
                            placeholder="Enter new password, Minumim 8 characters"
                            v-model="formDataEnterNewPassword.newPassword"
                            required
                            minlength="8"
                        >
                    </div>
                    <div class="form-group">
                        <input 
                            type="password" 
                            class="form-control" 
                            placeholder="Enter confirm password"
                            v-model="formDataEnterNewPassword.confirmNewPassword"
                            required
                            minlength="8"
                        >
                    </div>
                    <button type="submit" class="btn"> change </button>
                </div>  
            </div>
        </form>
        <!-- Enter New Password -->
    </div>

    <!-- Verify Password Successfully -->
    <div id="alert-success" v-if="isShowMsgVerifySuccess">
        <i class="fa fa-check"> </i>
        <p>
            Verify Password Successfully, Please Enter New Password
        </p>
    </div>
    <!-- Verify Password Successfully -->

    <!-- Verify Password Failed -->
    <div id="alert-danger" v-if="isShowMsgVerifyFaild">
        <i class="fa fa-exclamation"> </i>
        <p>
            Verify Password Failed, Please Try Again
        </p>
    </div>
    <!-- Verify Password Failed -->

    <!-- New Password and Current Password Not Match -->
    <div id="alert-danger" v-if="isShowMsgPasswordsNotMatch">
        <i class="fa fa-exclamation"> </i>
        <p>
            The Password And Confirm Password Not Match, Please Try Again
        </p>
    </div>
    <!-- New Password and Current Password Not Match -->

    <!-- Change Password Successfully -->
    <div id="alert-success" v-if="isShowMsgChangePasswordSuccess">
        <i class="fa fa-check"> </i>
        <p>
            Password Changed Successfully
        </p>
    </div>
    <!-- Change Password Successfully -->

</template>

<style>
#profile-change-password-user{
    padding: 30px 35px; 
}
#profile-change-password-user input:focus{
    border-color: var(--main-color);
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 
                        0 0 10px rgba(111, 61, 244, 0.6); 
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 10px rgba(111, 61, 244, 0.6);
}
#profile-change-password-user h5{
    color: var(--gray-text);
    text-transform: uppercase;
    letter-spacing: 1.02px;
}
#profile-change-password-user .verify-current-password .form-group{
    margin: 30px 0px 30px 0px;
    width: 60%;
}
#profile-change-password-user .verify-current-password .form-group p{
    margin-top: 5px;
}
#profile-change-password-user .verify-current-password button{
    background: var(--main-color);
    color: var(--white-color);
    font-size: 18px;
    letter-spacing: 1.02px;
    padding: 7px 21px;
    text-transform: capitalize;
}

#profile-change-password-user .enter-new-password{
    margin-top: 30px;
}
</style>
