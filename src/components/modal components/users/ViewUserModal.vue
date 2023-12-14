<script>

import '@/styles/profile.css'
import useUsers from '@/composables/users'
import { onMounted } from 'vue'

export default {
    props:{
        modelID: {} ,
        userID: {}
    } ,
   setup(props) {

        const {rowUser , getUser} = useUsers();

        let modelID = props.modelID;
        let userID = props.userID;

        onMounted(()=>{
            getUser(userID);
        });

        return {
            modelID ,
            userID ,
            rowUser ,
        }
    },
}

</script>

<template>
    <div class="modal fade" :id="modelID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="exampleModalLabel">
                        View User Info
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <section 
                        id="profile" 
                        class="home-view-section-all"
                        v-for="user in rowUser.data"
                        :key="user"
                    >
                        <div class="container-fluid">
                            <div class="row">
                                <div class="avater col-sm-3">
                                    <img
                                        v-if="user.avatar == null && user.gender == 'male'" 
                                        src="@/assets/man.png" 
                                    > 
                                    <img
                                        v-else-if="user.avatar == null && user.gender == 'female' "
                                        src="@/assets/woman.png" 
                                    >
                                </div>

                                <div class="user-info col-sm-9">

                                    <div class="name-address-role-category">
                                        <div class="name-address">
                                            <h2> {{user.full_name}} </h2>
                                            <span class="address">
                                                <i class="fa fa-map-marker"></i>
                                                {{user.address}}
                                            </span>
                                        </div>
                                        <div class="role-category">
                                            <div>
                                                <span class="role">{{user.role_name}}</span>
                                                <span 
                                                    class="category"
                                                    v-if="user.category_name != null"
                                                > - {{user.category_name}} </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="rank"
                                        v-if="user.role_name != 'super admin' || user.role_name != 'product owner'"
                                    >
                                        <h6>rankings</h6>
                                        <div class="rank-star-number">
                                            <span> {{user.rank}} </span>
                                            <div class="starts">
                                                <i 
                                                    v-for="star in Math.round(Math.round(user.rank)/2)" 
                                                    :key="star"
                                                    class="fa fa-star"
                                                    >
                                                </i>
                                                <i 
                                                    v-for="star in 5 - Math.round(Math.round(user.rank)/2)" 
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
                                                <i class="fa fa-user"></i>
                                                about
                                            </li>
                                        </ul>
                                    </div>

                                </div>

                <div class="skills col-sm-3">
                    <div class="skills-info">
                        <h5 v-if="rowUser.skills.length != 0"> skills </h5>
                        <ul>
                            <li 
                                v-for="skill in rowUser.skills" :key="skill"
                            > 
                                {{skill.name}}    
                            </li>
                        </ul>
                    </div>
                    
                </div>
                <div class="col-sm-9">
                    <div id="about-info-user">
                        <h5> contact information </h5>
                        <div class="contact-info">
                            <ul>
                                <li> <i class="fa fa-phone"></i> </li>
                                <li> <i class="fa fa-envelope"></i> </li>
                                <li> <i class="fa fa-map-marker"></i> </li>
                            </ul>
                            <ul>
                                <li>  phone </li>
                                <li>  email </li>
                                <li>  address </li>
                            </ul>
                            <ul>
                                <li> {{user.phone}} </li>
                                <li> {{user.email}} </li>
                                <li> {{user.address}} </li>
                            </ul>
                        </div>

                        <h5> Basic information </h5>
                        <div class="basic-info">
                            <ul>
                                <li> <i class="fa fa-birthday-cake"></i> </li>
                                <li> <i class="fa fa-user"></i> </li>
                            </ul>
                            <ul>
                                <li>  bithday </li>
                                <li>  gender </li>
                            </ul>
                            <ul>
                                <li> {{user.birthday}} </li>
                                <li> {{user.gender}} </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                    </section>
                </div>
            </div>  
        </div>
    </div>
</template>

<style scoped>
.links ul li{
    position: relative;
    top: 6px;
    border-bottom: 4px solid var(--main-color);
}
</style>