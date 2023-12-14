<script>
import usePermissionRole from '@/composables/permission-role';
export default {
    props:{
        roleID: {},
        permissionID: {} ,
        roleName: {} ,
        permissionName: {} ,
        modelID: {}
    } ,
    setup(props) {

        let roleID = props.roleID;
        let permissionID = props.permissionID;
        let roleName = props.roleName;
        let permissionName = props.permissionName;
        let modelID = props.modelID;

        const {manageAssignPermissionRole} = usePermissionRole();
        
        return{
            roleID ,
            permissionID ,
            roleName ,
            permissionName ,
            modelID ,
            manageAssignPermissionRole
        }
    }
}
</script>

<template>
    <!-- Bootstrap Modal Logout  -->
    <div class="modal fade" :id="modelID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text danger" id="exampleModalLabel">
                        Change Permission
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="manageAssignPermissionRole({
                            role_id: roleID ,
                            permission_id: permissionID
                        })"
                >
                    <div class="modal-body">
                        Are you sure to change the <b> {{permissionName}} </b> 
                        assign for the <b> {{roleName}} </b> ?
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
