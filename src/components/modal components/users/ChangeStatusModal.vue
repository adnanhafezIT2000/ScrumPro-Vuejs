<script>
import useUsers from '@/composables/users';
import { reactive } from 'vue';

export default {
    props:{
        modalID: {} ,
        userID: {} ,
        userFullName:{}
    } ,
    setup(props) {
        let modalID = props.modalID;
        let userID = props.userID;
        let userFullName = props.userFullName;

        const {changeStatusUser} = useUsers();

        let formData = reactive({
            "id": userID
        });

        return{
            modalID ,
            userID ,
            userFullName ,
            formData ,
            changeStatusUser
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
                    <h4 class="modal-title text" id="exampleModalLabel">
                        Change Status User 
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="changeStatusUser(formData)">
                    <div class="modal-body">
                        Are you sure to <b>change status {{userFullName}}</b> ?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-success">
                            change
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Bootstrap Modal Logout  -->
</template>
