<script>

import { useRouter } from 'vue-router';
import { ref } from 'vue';
import '@/styles/navbar.css'

export default {
    setup(){

        let userInfo = JSON.parse(localStorage.getItem('user-info'));
        let permissions = JSON.parse(localStorage.getItem('permissions'));

        const router = useRouter();

        let isShowLogoutModal = ref(false);

        const showLogoutModal = () =>{

            isShowLogoutModal.value = true;
            document.body.style.cssText = 'overflow:hidden'; 
        }

        const closeLogoutModal = () =>{

            isShowLogoutModal.value = false;
            document.body.style.cssText = 'overflow:scroll';
        }

        const logout = () =>{

            localStorage.clear();
            router.push("/home");
        }

        return{
            isShowLogoutModal ,
            showLogoutModal ,
            closeLogoutModal ,
            logout ,
            userInfo ,
            permissions
        }
    }
}

</script>

<template>
    <!-- Navbar -->
    <nav class="shadow-sm">
        <div class="container">
            <div class="logo">
                <h1> Scrum<span>Pro</span> </h1>
            </div>
            <div class="content-nav">
                <div class="dropdown">
                    <div class="user-info dropdown-toggle" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <div class="avatar shadow-sm">

                            <img
                                v-if="userInfo[0].avater != null" 
                                src="../assets/team-2.jpg" alt=""
                            >
                            <img
                                v-else-if="userInfo[0].avater == null && userInfo[0].gender == 'male'" 
                                src="../assets/man.png" alt=""
                            >
                            <img
                                v-else-if="userInfo[0].avater == null && userInfo[0].gender == 'female' " 
                                src="../assets/woman.png" alt=""
                            >
                            <img
                                v-if="userInfo[0].avater == null && userInfo[0].gender == 'none'" 
                                src="../assets/man.png" alt=""
                            >
                        </div>
                        <div class="user-name">
                            <p> {{userInfo[0].full_name}} </p>
                        </div>
                    </div>
                    <ul class="dropdown-menu dropdown-user" aria-labelledby="dropdownMenuButton1">
                        <li v-if="permissions.includes('show my profile')">
                            <router-link 
                                :to="{
                                        name: 'my-profile-about' , 
                                        path: '/home/profile' ,
                                    }"
                                exact
                                class="dropdown-item" 
                            >
                                <i class="fa fa-user"></i>
                                Profile
                            </router-link>
                        </li>
                        
                        <li>
                            <a 
                                class="dropdown-item" 
                                @click="showLogoutModal"
                            >
                                <i class="fa fa-sign-out"></i>
                                Logout
                            </a>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </div>
    </nav>
    <!-- Navbar -->

    <!-- Logout Modal -->
    <div class="modal-main" id="logoutModal" v-if="isShowLogoutModal">
        <div class="modal-box">
            <div class="box-header">
                <h5>
                    <i class="fa fa-exclamation-triangle text-danger"></i>
                    Logout
                </h5>
                <button class="btn-close" @click="closeLogoutModal"></button>
            </div>
            <div class="box-body">
                Are you sure to <b>Logout</b> ?
            </div>
            <div class="box-footer">
                <button 
                    type="button" 
                    class="btn btn-secondary" 
                    @click="closeLogoutModal"
                >
                    close
                </button>
                <button 
                    class="btn btn-danger"
                    @click="logout"
                >
                    <i class="fa fa-sign-out text-white"></i>
                    logout
                </button>
            </div>
        </div>
    </div>
    <!-- Logout Modal -->
</template>