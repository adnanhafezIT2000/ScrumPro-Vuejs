<script>
import axios from 'axios';
export default {
    props:{
        modelID: {},
        projectID: {}
    } ,
    setup(props) {
        
        let modelID = props.modelID;
        let projectID = props.projectID;

        const closeProject = async ()=>{

            await axios.get(`http://127.0.0.1:8000/api/ScrumPro/close-project/${projectID}`)
            .then((response)=>{
                if(response.data.status){
                    location.reload();
                }
            });
        }

        return{
            modelID ,
            projectID ,
            closeProject
        }
    },
}
</script>

<template>
    <!-- Bootstrap Modal Logout  -->
    <div class="modal fade" :id="modelID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text danger" id="exampleModalLabel">
                        Close Project
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure to close this <b> project </b> ?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-success" @click="closeProject">
                        Close Project
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- Bootstrap Modal Logout  -->
</template>