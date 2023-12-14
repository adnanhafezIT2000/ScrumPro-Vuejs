<script>

import axios from 'axios';
import { onMounted, ref } from 'vue';

export default {
    props:{
        modalID: {} ,
        projectID: {} ,
    } ,
    
    setup(props) {

        let modalID = props.modalID;
        let projectID = props.projectID;

        let projectInfo  = ref([]);
        let productOwner = ref([]);
        let stories      = ref([]);
        let sprints      = ref([]);
        let team         = ref([]);

        /*********************
         * Get Project Info 
        *********************/
        const getProjectInfo = async ()=>{

            await axios.get(`http://127.0.0.1:8000/api/ScrumPro/projects/${projectID}`)
            .then((response)=>{
                projectInfo.value  = response.data.project_info;
                productOwner.value = response.data.product_owner; 
                stories.value      = response.data.stories;
                sprints.value      = response.data.sprints;
                team.value         = response.data.team;
            })
        }
        
        /*****************
         * On Mounted
        *****************/
        onMounted(()=>{
            getProjectInfo();
        });

        /*************
         * Return
        *************/
        return{
            modalID ,
            projectInfo ,
            productOwner ,
            stories ,
            sprints ,
            team
        }
    },
}
</script>

<template>
    <div class="modal fade modal-xl" :id="modalID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text danger" id="exampleModalLabel">
                        View Project Info
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-sm-6 basic-info">
                                <h5> basic information </h5>
                                <div class="list">
                                    <ul>
                                        <li>
                                            <img
                                                v-if="productOwner.avatar == null && productOwner.gender == 'male'" 
                                                src="@/assets/man.png" 
                                                width="55" 
                                                height="55"
                                                class="img-user"
                                            > 
                                            <img
                                                v-else-if="productOwner.avatar == null && productOwner.gender == 'female' "
                                                src="@/assets/woman.png" 
                                                width="55" 
                                                height="55"
                                                class="img-user"
                                            >
                                            {{productOwner.full_name}}
                                        </li>
                                        <li>{{projectInfo.name}} project</li>
                                        <li>{{projectInfo.description}}</li>
                                        <li>$ {{projectInfo.budget}}</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-sm-6 team-info">
                                <h5> team information </h5>
                                <div class="list">
                                    <div class="row">
                                        <div 
                                            class="col-sm-5 shadow-sm"
                                            v-for="row in team"
                                            :key="row"
                                        >
                                            <img
                                                v-if="row.avatar == null && row.gender == 'male'" 
                                                src="@/assets/man.png" 
                                                width="55" 
                                                height="55"
                                                class="img-user"
                                            > 
                                            <img
                                                v-else-if="row.avatar == null && row.gender == 'female' "
                                                src="@/assets/woman.png" 
                                                width="55" 
                                                height="55"
                                                class="img-user"
                                            >
                                            <p> {{row.full_name}} </p>
                                            <span v-if="row.category_name == null"> 
                                                scrum master 
                                            </span>
                                            <span v-else>{{row.category_name}}</span>
                                            <div class="rank">
                                                <i> {{row.rank}} </i>
                                                <i 
                                                    v-for="star in Math.round(Math.round(row.rank)/2)" 
                                                    :key="star"
                                                    class="fa fa-star"
                                                    >
                                                </i>
                                                <i 
                                                    v-for="star in 5 - Math.round(Math.round(row.rank)/2)" 
                                                    :key="star"
                                                    class="fa fa-star-o"
                                                >
                                                </i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6 work-info">
                                <h5> work information </h5>
                                <div class="story">
                                    <h6> Story (<b>{{stories.total_count_stories}}</b>) </h6>
                                    <ul>
                                        <li> to do ({{stories.count_todo_stories}}) </li>
                                        <li> in progress ({{stories.count_progress_stories}}) </li>
                                        <li> done ({{stories.count_done_stories}}) </li>
                                    </ul>
                                </div>
                                <div class="sprint">
                                    <h6> sprint</h6>
                                    <ul v-for="sprint in sprints" :key="sprint">
                                        <li>
                                            <p> {{sprint.name}} </p>
                                            <span> {{sprint.strat_date}} - {{sprint.end_date}} </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-sm-6 time-line">
                                <h5> time line </h5>
                                <div class="content">
                                    <ul>
                                        <li> Date created : </li>
                                        <li> Planned Target Date : </li>
                                        <li> Date closed : </li>
                                    </ul>
                                     <ul>
                                        <li> {{projectInfo.project_created}} </li>
                                        <li> {{projectInfo.planned_termination_date}} </li>
                                        <li v-if="projectInfo.actual_termination_date == null"> 
                                            None
                                        </li>
                                        <li v-else> {{projectInfo.actual_termination_date}} </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container{
    height: auto;
}
.container .row div{
    padding: 0px 10px;
    margin-bottom: 25px;
}

/* Section Header h5 */
.container .row div h5{
    color: var(--main-color);
    letter-spacing: 2.08px;
    text-transform: capitalize;
}

/* Section Basic Information */
.container .row .basic-info .list{
    display: flex;
    justify-content: space-between;
    align-content: center;
}
.container .row .basic-info .list ul {
    list-style-type: none;
    margin-top: 15px;
}
.container .row .basic-info .list ul li{
    margin-bottom: 10px;
    color: var(--black-color);
}
.container .row .basic-info .list ul li img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 5px;
}
.container .row .basic-info .list ul li:nth-child(1) , 
.container .row .basic-info .list ul li:nth-child(2){
    font-size: 20px;
}
.container .row .basic-info .list ul li:nth-child(3){
    text-align: justify;
    font-size: 16px;
    line-height: 24px;
    width: 80%;
}
.container .row .basic-info .list ul li:nth-child(2) ,
.container .row .basic-info .list ul li:last-child{
    font-size: 24px;
    font-weight: bold;
    color: var(--yellow-color);
}

/* Section Team Information */
.container .row .team-info .list{
    margin-top: 15px;
}
.container .row .team-info .list .row{
    border: none;
    width: 100%;
}
.container .row .team-info .list .row div{
    position: relative;
}
.container .row .team-info .list div{
    margin-bottom: 10px;
    margin-right: 10px;
    background: white;
    border: 1px solid var(--gray-color);
    padding: 10px 10px 38px 10px;
    border-radius: 0.25rem;
    position: relative;
    width: 230px;
}
.container .row .team-info .list div img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    position: relative;
    top: 10px;
}
.container .row .team-info .list div p{
    font-size: 18px;
    color: var(--black-color);
    position: absolute;
    top: 10px;
    left: 80px;
    height: 23px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.container .row .team-info .list div span{
    font-size: 18px;
    color: var(--yellow-color);
    font-weight: bold;
    position: absolute;
    top: 40px;
    left: 80px;
}
.container .row .team-info .list div .rank{
    color: var(--main-color);
    font-size: 18px;
    margin-left: -5px;
    position: absolute;
    top: 60px;
    left: 75px;
    border: none;
    background: none;
}
.container .row .team-info .list div .rank i{
    margin-right: 2px;
}
.container .row .team-info .list div .rank i:first-child{
    color: var(--black-color);
    font-weight: bold;
    font-style: normal;
    margin-right: 5px;
}

/* Section Work Information */
.container .row .work-info div{
    margin-left: 35px;
    margin-top: 20px;
}
.container .row .work-info ul{
    list-style-type: none;
}
.container .row .work-info div h6{
    font-size: 18px;
    color: var(--black-color);
    text-transform: capitalize;
}
.container .row .work-info div ul li{
    display: flex;
    color: var(--black-color);
    padding-top: 6px;
}
.container .row .work-info .sprint ul li{
    width: 60%;
    justify-content: space-evenly;
    align-content: center;
    margin-left: -29px;
    width: 80%;
}
.container .row .work-info .sprint ul li span{
    margin-left: 5px;
}
.container .row .work-info .sprint ul li i{
    width: 25px;
    height: 25px;
    border-radius: 50%;
    color: white;
    background: var(--yellow-color);
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Section Time Line */
.container .row .time-line .content{
    display: flex;
    background: none;
    border: none;
    width: 90%;
    font-size: 18px;
    margin-left: -5px;
}
.container .row .time-line .content ul{
    list-style-type: none;
}
.container .row .time-line .content ul li{
    padding-bottom: 13px;
}
.container .row .time-line .content ul:first-child li{
    font-weight: bold;
}
</style>
