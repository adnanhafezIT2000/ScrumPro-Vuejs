<script>

import axios from 'axios'
import '@/styles/board.css'
import { onMounted, ref } from 'vue';

export default {
    setup() {

        const project = JSON.parse(localStorage.getItem('project'));
        const projectID = project.id;

        const storiesBorad = ref([]);
        const getStoriesBoard = async ()=>{
            const response = await axios.get(`http://127.0.0.1:8000/api/ScrumPro/get-stories-board/${projectID}`);
            storiesBorad.value = response.data;
        }

        onMounted(()=>{
            getStoriesBoard();
        });

        return{
            storiesBorad
        }
    },
}

</script>

<template>
    <div id="board">
        <header>
            <h4> board </h4>
        </header>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-4">
                    <div class="container">
                        <section class="col-sm-12 section-todo">
                            <h6> to do  </h6>
                            <div 
                                class="go-to-backlog"
                                v-if="storiesBorad.todo_count == 0"
                            >
                                <img src="https://jira-frontend-static.prod.public.atl-paas.net/assets/agile.4a9b323a3ed2803c9ec4fc8a8b1464ab.8.svg" alt="">
                                <h5> Get started in the backlog </h5>
                                <p>
                                    plan and start a sprint to see stories here.
                                </p>
                                <router-link :to="{name: 'backlog'}">
                                    Go to backlog
                                </router-link>
                            </div>
                            <div 
                                class="story-box col-sm-12 shadow-sm bg-white"
                                v-else
                                v-for="story in storiesBorad.todo"
                                :key="story"
                            >
                                <p> {{story.title}} </p>
                                <div class="story-info">
                                    <div class="status">
                                        <i class="fa fa-hourglass-start"></i>
                                    </div>
                                    <div class="point">
                                        {{story.points}}
                                    </div>
                                    <div class="priority">
                                        <i 
                                            :class="story.priority != null ? 'fa fa-flag flag-'+story.priority : ''"
                                        ></i>
                                        {{story.priority}}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>                 
                </div>
                <div class="col-sm-4">
                    <div class="container">
                        <section class="col-sm-12 section-progress">
                            <h6> in progress  </h6>
                            <div 
                                class="story-box col-sm-12 shadow-sm bg-white"
                                v-for="story in storiesBorad.progress"
                                :key="story"
                            >
                                <p> {{story.title}} </p>
                                <div class="story-info">
                                    <div class="status">
                                        <div class="spinner-border spinner-border-sm" role="status"></div>
                                    </div>
                                    <div class="point">
                                        {{story.points}}
                                    </div>
                                    <div class="priority">
                                        <i 
                                            :class="story.priority != null ? 'fa fa-flag flag-'+story.priority : ''"
                                        ></i>
                                        {{story.priority}}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>            
                </div>
                <div class="col-sm-4">
                    <div class="container">
                        <section class="col-sm-12 section-done">
                            <h6> done  </h6>
                            <div 
                                class="story-box col-sm-12 shadow-sm bg-white"
                                v-for="story in storiesBorad.done"
                                :key="story"
                            >
                                <p> {{story.title}} </p>
                                <div class="story-info">
                                    <div class="status">
                                        <i class="fa fa-check"></i>
                                    </div>
                                    <div class="point">
                                        {{story.points}}
                                    </div>
                                    <div class="priority">
                                        <i 
                                            :class="story.priority != null ? 'fa fa-flag flag-'+story.priority : ''"
                                        ></i>
                                        {{story.priority}}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>                
                </div>
            </div>
        </div>
    </div>
</template>
