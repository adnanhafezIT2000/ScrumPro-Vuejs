<script>

import useUsers from '@/composables/users'
import { onMounted } from 'vue'

export default {
    props:{
        userID:{}
    } ,
    setup(props) {

        const {rowUser , getUser} = useUsers();

        let userID = props.userID;

        onMounted(()=>{
            getUser(userID);
        });

        return{
            userID ,
            rowUser ,
        }
    },
}

</script>

<template>
    <div 
        id="about-info-user"
        v-for="user in rowUser.data"
        :key="user"
    >

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
                <li v-if="user.role_id != '154'"> {{user.birthday}} </li>
                 <li v-else> none </li>
                <li> {{user.gender}} </li>
            </ul>
        </div>
    </div>
</template>

<style>
#about-info-user{
   padding: 30px 35px; 
}
#about-info-user h5{
    color: var(--gray-text);
    text-transform: uppercase;
    letter-spacing: 1.02px;
}
#about-info-user .contact-info , 
#about-info-user .basic-info{
    display: flex;
}
#about-info-user .contact-info ul , 
#about-info-user .basic-info ul{
    list-style: none;
}
#about-info-user .contact-info ul:nth-child(2) , 
#about-info-user .basic-info ul:nth-child(2){
    margin-left: -25px;
}
#about-info-user .contact-info ul:nth-child(3) , 
#about-info-user .basic-info ul:nth-child(3){
    margin-left: 5px;
}
#about-info-user .contact-info ul li , 
#about-info-user .basic-info ul li{
    margin: 10px 0px;
}
#about-info-user .contact-info ul:nth-child(1) li , 
#about-info-user .basic-info ul:nth-child(1) li{
    color: var(--main-color);
    font-size: 16px;
}
#about-info-user .contact-info ul:nth-child(2) li , 
#about-info-user .basic-info ul:nth-child(2) li{
    color: var(--black-color);
    font-weight: 600;
    text-transform: capitalize;
}
</style>
