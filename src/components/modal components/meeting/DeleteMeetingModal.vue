<script>
import axios from 'axios';

export default {
    props:{
        modalID: {} ,
        meetingID: {} ,
    } , 
    setup(props) {
        
        let modalID = props.modalID;
        let meetingID = props.meetingID;

        const destroyMeeting = async (id)=>{

            await axios.delete(`http://127.0.0.1:8000/api/ScrumPro/meeting/${id}`);
            location.reload();
        }

        return{
            modalID ,
            meetingID ,
            destroyMeeting
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
                        Delete Meeting
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="left: -99px">
                    Are you sure to <b>delete this meeting</b> ?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button 
                        type="button" 
                        class="btn btn-danger"
                        @click="destroyMeeting(meetingID)"
                    >
                        <i class="fa fa-trash text-white"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
