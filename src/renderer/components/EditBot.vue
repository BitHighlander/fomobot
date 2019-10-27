<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background" @click="closeModal"></div>
		<div class="modal-card" style="width:480px;height:600px">
			<header class="modal-card-head" style="background-color: #1e1e2f;">

				<p class="modal-card-title text-white">{{ $t("msg.register.title") }}</p>

			</header>
			<section class="modal-card-body" style="height:680px;background-color: darkslateblue;">
				<textarea class="textarea" readonly>{{rawBot}}</textarea>


			</section>
		</div>
	</div>

</template>
<script>
    import service from "../../modules/diagonService.js"
    import { messageBus } from '@/messagebus'
    import {version, grinNode, gnodeOption, getConfig, updateConfig, getWallet,getModel} from '../../modules/config'


    export default {
        name: "EditBot",
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                rawBot:false,

            }
        },
        beforeDestroy: function(){
            this.showModal = false
        },
		async created(){
            messageBus.$on('SelectBot', async (botname) => {
                this.$log.info("select bot: ",botname)

				this.rawBot = await getModel(botname)

            })
		},
        async mounted() {
            //wait 2 seconds for file to write


            //check config file has keys

        },
        methods: {
            verifyAccepted(){

            },
            async tryLogin(){



            },
            closeModal() {
                messageBus.$emit('close', 'windowEditBot');
            },
            randomUsername() {
                let newUser = harryPotterNames.random()
                newUser = newUser.replace(/ /g, '_');
                this.username = newUser
            },
            async checkForm(){

            },
            async submitForm() {
                //let isValid = await this.checkForm()

            },
        }
    }
</script>
<style>

	.is-vertical-center {
		display: flex;
		align-items: center;
	}

	.rows{
		display: flex;
		align-items: center;
		flex-direction: column;
		position: relative;
	}

	.field-icon {
		float: right;
		margin-left: -25px;
		margin-top: -25px;
		position: relative;
		z-index: 2;
	}

	.container{
		padding-top:50px;
		margin: auto;
	}

	.center{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
