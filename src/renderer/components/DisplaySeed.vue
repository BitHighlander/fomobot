<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background" @click="closeModal"></div>
		<div class="modal-card" style="width:480px">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ $t("msg.seedTitle") }}</p>
				<button class="delete" aria-label="close" @click="closeModal" ></button>
			</header>
			<section class="modal-card-body" style="height:380px;background-color: whitesmoke;">

				<ol>
					<li v-for="item in seeds">
						{{ item }}
					</li>
				</ol>

				<!--				<remove :showModal="openRemove"></remove>-->
<!--				<a class="button" @click="getSeed">get seed</a>-->


			</section>
		</div>
	</div>

</template>
<script>

    import { messageBus } from '@/messagebus'
    import {version, grinNode, gnodeOption} from '../../modules/config'

    const fs = require('fs');

    export default {
        name: "DisplaySeed",
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
			this.getSeed()
        },
        methods: {
            async getSeed(){
                this.$log.info('checkpoint get seed!')
                this.$log.info('password: ',this.password)

				let password = this.$walletService.getPassword()
                let seed = await this.$walletService.displaySeed(password,grinNode)

				if(!seed.seed){
				    this.error = "unable to get seed! "+seed.error
				}else{
                    this.seeds = seed.seed
				}

            },
            closeModal() {
                messageBus.$emit('close', 'windowDisplaySeed');
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
