<script>
import useDefinition from '@/composables/definitions';

export default {
    props:{
        modalID: {} ,
        definitionID: {} ,
    } , 
    setup(props) {
        
        const {destroyDefinition} = useDefinition()

        let modalID = props.modalID;
        let definitionID = props.definitionID;

        return{
            modalID ,
            definitionID ,
            destroyDefinition
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
                        Delete Definition
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure to <b>delete this definition</b> ?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button 
                        type="button" 
                        class="btn btn-danger"
                        @click="destroyDefinition(definitionID)"
                    >
                        <i class="fa fa-trash text-white"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
