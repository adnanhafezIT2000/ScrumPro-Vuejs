<script>

import NavbarComponent from '@/components/NavbarComponent.vue';
import SidebarComponent from '@/components/SidebarComponent.vue';

export default {
    components:{
        NavbarComponent , 
        SidebarComponent
    } ,

    setup() {

        const userInfo = JSON.parse(localStorage.getItem('user-info'));
        const permissions = JSON.parse(localStorage.getItem('permissions'));

        const isShowSideBer = () =>{

            if(permissions.includes('show only projects he has worked on') && localStorage.key(2) == null){

                return false;

            }else {

                return true;
            }
        }

        return{
            userInfo ,
            permissions ,
            isShowSideBer
        }
    },
}

</script>

<template>
    <NavbarComponent />
    <div class="page">
        <div class="container-fluid">
            <div class="row">
                
                <div 
                    class="sidebar"
                    v-if="isShowSideBer()"
                >
                    <SidebarComponent />
                </div>
                
                <div 
                    :class="isShowSideBer() ? 'content' : 'full-content'"
                >
                    <div class="container">
                        <router-view />
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style>
.page{
    width: 100%;
    min-height: calc(100vh - 70px);
}
.page .container-fluid{
    height: calc(100vh - 70px);
} 
.page .container-fluid .row .sidebar{
   width: 220px;
}
.page .container-fluid .row .content{
    width: calc(100% - 260px);
    padding: 10px;
    border-left: 1px solid var(--gray-color);
    background: whitesmoke;
    margin-left: 40px;
}
.page .container-fluid .row .full-content{
    width: 100%;
    padding: 50px 0px 0px 20px;
    /*border-left: 1px solid var(--gray-color);*/
    background: whitesmoke;
    /*margin-left: 40px;*/
    min-height: calc(100vh - 70px);
}
.page .container-fluid .row .content .container{
    margin-top: 10px;
    padding: 10px;
    width: 98%;
}
.page .container-fluid .row .full-content .container{
    margin-top: 10px;
    padding: 10px;
    width: 98%;
}
</style>
