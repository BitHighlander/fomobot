<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background"></div>
		<div class="modal-card" style="width:480px">
			<header class="modal-card-head">
				{{ $t("msg.passwordTitle") }}

			</header>
			<section class="modal-card-body" style="height:380px;background-color: whitesmoke;">

				Select language



				<div class="dropdown is-active">
					<div class="dropdown-trigger">

						<button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
							<span>Dropdown button</span>
							<span class="icon is-small">
							<i class="fas fa-angle-down" aria-hidden="true"></i>
						  </span>
						</button>

					</div>
					<div class="dropdown-menu" id="dropdown-menu" role="menu">
						<div class="dropdown-content">
							<a href="#" class="dropdown-item">
								Dropdown item
							</a>
							<a class="dropdown-item">
								Other dropdown item
							</a>
							<a href="#" class="dropdown-item is-active">
								Active dropdown item
							</a>
							<a href="#" class="dropdown-item">
								Other dropdown item
							</a>
							<hr class="dropdown-divider">
							<a href="#" class="dropdown-item">
								With a divider
							</a>
						</div>
					</div>
				</div>

				<!--				<remove :showModal="openRemove"></remove>-->



			</section>
		</div>
	</div>

</template>
<script>

    import { messageBus } from '@/messagebus'
    import {version, grinNode, gnodeOption} from '../../modules/config'


    export default {
        name: "Migration",
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {

            }
        },
        beforeDestroy: function(){
            this.showModal = false
        },
        mounted() {
            //this.checkRunning()
            //this.$log.info('isfirst(login.vue)? '+isFirstTime())
            //this.firstTime = isFirstTime()
        },
        methods: {
            closeModal() {
                messageBus.$emit('close', 'windowConfigurations');
                this.clearup()
            },
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
