<script>
import useDefinition from '@/composables/definitions'
import { onMounted } from 'vue';

export default {
    props:{
        modalID: {} ,
        definitionID: {}
    } ,

    setup(props) {
        const {showDefinition , updateDefinition , definition} = useDefinition();

        let modalID = props.modalID;
        let definitionID = props.definitionID;

        onMounted(()=>{
            showDefinition(definitionID);
        })

        return{
            modalID ,
            definitionID ,
            definition ,
            updateDefinition,
        }
    },
}
</script>

<template>
    <div class="modal fade" :id="modalID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="exampleModalLabel">
                        Edit Definition Of Done
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="updateDefinition(definitionID)">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="definition-name" class="col-form-label">
                                Definition
                            </label>
                            <textarea 
                                class="form-control" 
                                placeholder="Enter definition description" 
                                id="definition-name"
                                v-model="definition.description"
                                required
                                rows="3"
                                ></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-success">
                            Edit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>