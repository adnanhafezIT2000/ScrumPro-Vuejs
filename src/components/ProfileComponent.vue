<script>
import '@/styles/profile.css'

export default {
    setup() {

        const userInfo = JSON.parse(localStorage.getItem('user-info'));
        const permissions = JSON.parse(localStorage.getItem('permissions'));

        return {
            userInfo ,
            permissions,
        }
    },
}
</script>

<template>
    <!-- My Profile -->
    <section id="profile" class="home-view-section-all">
        <div class="container-fluid">
            <div class="row">
                <div class="avater col-sm-3">
                    
                    <img src="@/assets/img/team/team-1.jpg">

                    <div class="d-flex justify-content-center input-file">
                        <div class="btn btn-rounded">
                            <label class="form-label text-white m-1" for="customFile1">
                                <i class="fa fa-camera"></i>
                            </label>
                            <input type="file" class="form-control d-none" id="customFile1" />
                        </div>
                    </div>
                </div>

                <div class="user-info col-sm-9">

                    <div class="name-address-role-category">
                        <div class="name-address">
                            <h2> {{userInfo[0].full_name}} </h2>
                            <span class="address">
                                <i class="fa fa-map-marker"></i>
                                {{userInfo[0].address}}
                            </span>
                        </div>
                        <div class="role-category">
                            <div>
                                <span class="role">{{userInfo[0].role_name}}</span>
                                <span 
                                    class="category"
                                    v-if="userInfo[0].category_id != null"
                                > - {{userInfo[0].category}} </span>
                            </div>
                        </div>
                    </div>

                    <div 
                        class="rank"
                        v-if="userInfo[0].role_name != 'super admin' && userInfo[0].role_name != 'product owner' && userInfo[0].role_name != 'client'"
                    >
                        <h6>rankings</h6>
                        <div class="rank-star-number">
                            <span> {{userInfo[0].rank}} </span>
                            <div class="starts">
                               <i 
                                    v-for="star in Math.round(Math.round(userInfo[0].rank)/2)" 
                                    :key="star"
                                    class="fa fa-star"
                                >
                                </i>
                                <i 
                                    v-for="star in 5 - Math.round(Math.round(userInfo[0].rank)/2)" 
                                    :key="star"
                                    class="fa fa-star-o"
                                >
                                </i>
                            </div>
                        </div>
                    </div>

                    <div class="links">
                        <ul>
                            <li>
                                <router-link  :to="{name: 'my-profile-about'}">
                                    <i class="fa fa-user"></i>
                                    about
                                </router-link>
                            </li>
                            <li v-if="permissions.includes('modify the password')">
                                <router-link :to="{name: 'my-profile-change-password'}">
                                    <i class="fa fa-shield"></i>
                                    change password
                                </router-link>
                            </li>
                        </ul>
                    </div>

                </div>

                <div class="skills col-sm-3">
                    <div 
                        class="skills-info"
                        v-if="userInfo[0].role_name != 'super admin' && userInfo[0].role_name != 'product owner' && userInfo[0].role_name != 'scrum master' && userInfo[0].role_name != 'client'"
                    >
                        <h5> skills </h5>
                        <ul>
                            <li v-for="skill in userInfo[0].skills" :key="skill">
                                {{skill.name}}
                            </li> 
                        </ul>
                    </div>
                </div>

                <div class="col-sm-9">

                    <router-view />
                    
                </div>

            </div>
        </div>
    </section>
    <!-- My Profile -->
</template>