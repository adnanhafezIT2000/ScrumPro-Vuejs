<script>

import useUsers from '@/composables/users';

export default {
    props:{
        modalID: {} ,
        userID: {} ,
        userFullName: {}
    } ,
    setup(props) {
        
        let modalID = props.modalID;
        let userID  = props.userID;
        let userFullName = props.userFullName;
        
        const {destroyUser} = useUsers();

        return{
            modalID ,
            userID ,
            userFullName ,
            destroyUser
        }
    },
}

</script>

<template>
    <!-- Bootstrap Modal Logout  -->
    <div class="modal fade" :id="modalID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text danger" id="exampleModalLabel">
                        <i class="fa fa-exclamation-triangle text-danger"></i>
                        Delete User 
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure to <b>delete {{userFullName}}</b> ?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button @click="destroyUser(userID)" type="button" class="btn btn-danger">
                        <i class="fa fa-trash text-white"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- Bootstrap Modal Logout  -->
</template>
