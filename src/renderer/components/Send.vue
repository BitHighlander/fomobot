<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background" @click="closeModal"></div>
		<div class="modal-card" style="width:480px">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ $t("msg.seedTitle") }}</p>
				<button class="delete" aria-label="close" @click="closeModal" ></button>
			</header>
			<section class="modal-card-body" style="height:380px;background-color: whitesmoke;">

			Send moniez

			</section>
		</div>
	</div>

</template>
<script>

    import { messageBus } from '@/messagebus'

    const fs = require('fs');

    export default {
        name: "Send",
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                seeds:[],
                password: '',
                error:''
            }
        },
        beforeDestroy: function(){
            this.showModal = false
        },
        mounted() {

        },
        methods: {

            closeModal() {
                messageBus.$emit('close', 'windowSend');
                this.clearup()
            }
        }
    }
</script>
<style>
	.center{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
