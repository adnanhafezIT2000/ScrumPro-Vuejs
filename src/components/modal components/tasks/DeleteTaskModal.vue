<script>
import axios from 'axios';

export default {
    props:{
        modalID: {} ,
        taskID: {}
    } ,

    setup(props) {
        const URL = 'http://127.0.0.1:8000/api/ScrumPro';
        let modalID = props.modalID;
        let taskID = props.taskID;

        /******************
         * Destroy Task
        ******************/
        const destroyTask = async () =>{
            await axios.delete(`${URL}/tasks/${taskID}`)
            .then((response)=>{
                if(response.data.status){
                    location.reload();
                }
            })
        };

        return{
            destroyTask ,
            modalID ,
            taskID
        }
    },
}
</script>

<template>
    <div class="modal fade" :id="modalID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text danger" id="exampleModalLabel">
                        <i class="fa fa-exclamation-triangle text-danger"></i>
                        Delete Task
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure <b>deleted</b> this task ?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button 
                        type="button" 
                        class="btn btn-danger"
                        @click="destroyTask(taskID)"
                    >
                        <i class="fa fa-trash text-white"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>