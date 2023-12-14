<script>
import '@/styles/sidebar.css'

export default {
    setup() {
        
        let userInfo = JSON.parse(localStorage.getItem('user-info'));

        let permissions = JSON.parse(localStorage.getItem('permissions'));

        const showProjectName = ()=>{

            const show = localStorage.key(1) == 'project' ? true  : false ;
        
            return show;
        }

        let project , projectName;
       
        if(permissions.includes('show only projects he has worked on')){

            project = JSON.parse(localStorage.getItem('project'));
            projectName = project.name;
        }
       

        return{
            userInfo ,
            permissions ,
            showProjectName ,
            projectName ,
        }

    },
}
</script>

<template>
    <!-- Sidebar -->
    <aside>
        <div class="container">
            <div class="row">
                
                <div 
                    class="col-sm-12 project-name"
                    v-if="showProjectName()"
                >
                    <h3 class="text-center"> {{projectName}} </h3>
                </div>

                <ul 
                    class="col-sm-12 links"
                >
                    <li>
                        <router-link :to="{name: 'dashboard'}">
                           <i class="fa fa-dashboard"></i>
                           <p> dashboard </p>
                        </router-link> 
                    </li>

                    <li 
                        v-if="permissions.includes('show all users')">
                        <router-link :to="{name: 'users'}">
                           <i class="fa fa-user"></i>
                           <p> users management </p>
                        </router-link> 
                    </li>

                    <li 
                        v-if="permissions.includes('show all roles and permissions')">
                        <router-link :to="{name: 'roles'}">
                           <i class="fa fa-cogs"></i>
                           <p> roles management </p>
                        </router-link> 
                    </li>

                    <li 
                        v-if="permissions.includes('show all teams')">
                        <router-link :to="{name: 'teams'}">
                           <i class="fa fa-users"></i>
                           <p> teams management </p>
                        </router-link> 
                    </li>

                    <li 
                        v-if="permissions.includes('show all categories')">
                        <router-link :to="{path: 'categories-management'}">
                           <i class="fa fa-certificate"></i>
                           <p> categories & skills </p>
                        </router-link> 
                    </li>

                    <li 
                        v-if="permissions.includes('show all projects (open,close)')">
                        <router-link :to="{name: 'all-projects'}">
                           <i class="fa fa-sitemap"></i>
                           <p> all projects </p>
                        </router-link> 
                    </li>

                    <li v-if="permissions.includes('show only projects he has worked on')">
                        <router-link :to="{name: 'all-projects'}">
                           <i class="fa fa-sitemap"></i>
                           <p> my projects </p>
                        </router-link> 
                    </li>

                    <li v-if="permissions.includes('show all definitions of done')">
                        <router-link :to="{name: 'definition-of-done-management'}">
                           <i class="fa fa-reorder"></i>
                           <p> definitions of done </p>
                        </router-link> 
                    </li>

                    <li v-if="permissions.includes('show project backlog')">
                        <router-link :to="{name: 'backlog'}">
                           <i class="fa fa-book"></i>
                           <p> backlog </p>
                        </router-link> 
                    </li>

                    <li v-if="permissions.includes('show project sprints')">
                        <router-link :to="{name: 'sprint'}">
                           <i class="fa fa-spinner"></i>
                           <p> sprints </p>
                        </router-link> 
                    </li>

                    <li v-if="permissions.includes('show stories borad to project')">
                        <router-link :to="{name: 'board'}">
                           <i class="fa fa-clipboard"></i>
                           <p> stories board </p>
                        </router-link> 
                    </li>

                    <li v-if="permissions.includes('sprint planning meeting')">
                        <router-link :to="{name: 'planning-meeting'}">
                            <i class="fa fa-handshake-o"></i>
                            <p> planning meeting </p>
                        </router-link>
                    </li>

                    <li v-if="permissions.includes('show tasks box')">
                        <router-link :to="{name: 'tasks-box'}">
                            <i class="fa fa-handshake-o"></i>
                            <p> tasks box </p>
                        </router-link>
                    </li>

                </ul>

            </div>
        </div>
    </aside>
    <!-- Sidebar -->
</template>