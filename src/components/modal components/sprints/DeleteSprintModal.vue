<script>
import axios from 'axios';

export default {

    props:{
        sprintID:{} ,
        sprintName:{} ,
        modelID:{}
    } ,
    
    setup(props) {

        let sprintID = props.sprintID;
        let sprintName = props.sprintName;
        let modelID = props.modelID;

        const destroySprint = async (id)=>{
            await axios.delete(`http://127.0.0.1:8000/api/ScrumPro/sprints/${id}`);
            location.reload();
        }

        return{sprintID , sprintName , modelID , destroySprint};
    }
}
</script>

<template>
    <!-- Delete Sprint Modal  -->
    <div class="modal fade gooclose deleteSprintModal" :id="modelID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text danger" id="exampleModalLabel">
                        <i class="fa fa-exclamation-triangle text-danger"></i>
                        Delete Sprint
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>
                        Deleting the roll will cause all the stories in it to be permanently deleted.
                        <br> <br>
                        Are you sure to <b>delete {{sprintName}}</b> ?
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button 
                        type="button" 
                        class="btn btn-danger"
                        id="closeBtn"
                        @click.prevent="destroySprint(sprintID)"
                    >
                        <i class="fa fa-trash text-white"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- Delete Sprint Modal  -->
</template>