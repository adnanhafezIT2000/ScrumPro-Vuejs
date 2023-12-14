<script>
import useStories from '@/composables/stories'
export default {
    props:{
        modalID: {} ,
        storyID: {}
    } ,

    setup(props) {
        
        const {destroyStory} = useStories();

        let modalID = props.modalID;
        let storyID = props.storyID;

        return{
            destroyStory ,
            modalID ,
            storyID
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
                        Delete Story
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    You're about to permanently delete this story, its comments and attachments, and all of its data.
                    <br>
                    <br>
                    If you're not sure, you can resolve or close this issue instead.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button 
                        type="button" 
                        class="btn btn-danger"
                        @click="destroyStory(storyID)"
                    >
                        <i class="fa fa-trash text-white"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>