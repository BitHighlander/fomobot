<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background" @click="closeModal"></div>
		<div class="modal-card" style="width:680px;">
			<header class="modal-card-head" style="background-color: #1e1e2f;">
				<p class="modal-card-title text-white">{{ $t("msg.seedTitle") }}</p>
				<button class="delete" aria-label="close" @click="closeModal" ></button>
			</header>
			<section class="modal-card-body" style="height:380px;background-color: darkslateblue;">

				<div>
					<div class="tabs wrap is-centered text-center" style="max-width:100%;border-width:thick ">
						<ul>
							<li :class="[ tabOpen === 'word1' ? 'is-active' : '']">
								<a @click="tabOpen='word1' " class="is-large">
									<input class="text-white is-disabled" style="border:none;border-style: none;width: 70px;background-color: darkslateblue;" v-model="word1" placeholder=""
										   @paste="onPaste" disabled>
								</a>1
							</li>
							<li :class="[ tabOpen === 'word2' ? 'is-active' : '']"><a
									@click="tabOpen='word2'">
								<input class="text-white is-disabled" style="border: none; border-style: none;width: 70px; background-color: darkslateblue;" v-model="word2" placeholder="" disabled>
							</a>2
							</li>
							<li :class="[ tabOpen === 'word3' ? 'is-active' : '']"><a
									@click="tabOpen='word3'">
								<input class="text-white is-disabled" style="border: none; border-style: none;width: 70px; background-color: darkslateblue;" v-model="word3" placeholder="" disabled>
							</a>3
							</li>
							<li :class="[ tabOpen === 'word4' ? 'is-active' : '']"><a
									@click="tabOpen='word4'">
								<input class="text-white is-disabled" style="border: none; border-style: none;width: 70px; background-color: darkslateblue;" v-model="word4" placeholder="" disabled>
							</a>4
							</li>
							<li :class="[ tabOpen === 'word5' ? 'is-active' : '']"><a
									@click="tabOpen='word5'">
								<input class="text-white is-disabled" style="border: none; border-style: none;width: 70px; background-color: darkslateblue;" v-model="word5" placeholder="" disabled>
							</a>5
							</li>
							<li :class="[ tabOpen === 'word6' ? 'is-active' : '']"><a
									@click="tabOpen='word6'">
								<input class="text-white is-disabled" style="border: none; border-style: none;width: 70px; background-color: darkslateblue;" v-model="word6" placeholder="" disabled>
							</a>6
							</li>
						</ul>
					</div>
					<div class="tabs is-centered text-center">
						<ul >

							<li :class="[ tabOpen === 'word7' ? 'is-active' : '']">
								<a @click="tabOpen='word7'">
									<input class="text-white is-disabled" style="border: none; border-style: none;width: 70px; background-color: darkslateblue;" v-model="word7" placeholder="" disabled>
								</a>7
							</li>
							<li :class="[ tabOpen === 'word8' ? 'is-active' : '']"><a
									@click="tabOpen='word8'">
								<input class="text-white is-disabled" style="border: none; border-style: none;width: 70px; background-color: darkslateblue;" v-model="word8" placeholder="" disabled>
							</a>8
							</li>
							<li :class="[ tabOpen === 'word9' ? 'is-active' : '']"><a
									@click="tabOpen='word9'">
								<input class="text-white is-disabled" style="border: none; border-style: none;width: 70px; background-color: darkslateblue;" v-model="word9" placeholder="" disabled>
							</a>9
							</li>
							<li :class="[ tabOpen === 'word10' ? 'is-active' : '']"><a
									@click="tabOpen='word10'">
								<input class="text-white is-disabled" style="border: none; border-style: none;width: 70px; background-color: darkslateblue;" v-model="word10" placeholder="" disabled>
							</a>10
							</li>
							<li :class="[ tabOpen === 'word11' ? 'is-active' : '']"><a
									@click="tabOpen='word11'">
								<input class="text-white is-disabled" style="border: none; border-style: none;width: 70px; background-color: darkslateblue;" v-model="word11" placeholder="" disabled>
							</a>11
							</li>
							<li :class="[ tabOpen === 'word12' ? 'is-active' : '']"><a
									@click="tabOpen='word12'">
								<input class="text-white is-disabled" style="border: none; border-style: none;width: 70px; background-color: darkslateblue;" v-model="word12" placeholder="" disabled>
							</a>12
							</li>
						</ul>
					</div>
				</div>
			</section>
		</div>
	</div>

</template>
<script>

    import { messageBus } from '@/messagebus'

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
				error:'',
                tabOpen: 'word1',
                word1: '',
                word2: '',
                word3: '',
                word4: '',
                word5: '',
                word6: '',
                word7: '',
                word8: '',
                word9: '',
                word10: '',
                word11: '',
                word12: '',
            }
        },
        beforeDestroy: function(){
            this.showModal = false
        },
        mounted() {
            messageBus.$on('getSeed', () => {
                this.$log.info("Update detected! ")
                this.getSeed()
            })
        },
        methods: {
            async getSeed(){
                this.$log.info('checkpoint get seed!')
                this.$log.info('password: ',this.password)

				let password = this.$walletService.getPassword()
                let seedWords = await this.$walletService.displaySeed(password)

                seedWords = seedWords.split(" ")
                console.log('seedWords', seedWords)


                this.word2 = seedWords[1]
                console.log('word2', this.word2)
                this.word3 = seedWords[2]
                this.word4 = seedWords[3]
                this.word5 = seedWords[4]
                this.word6 = seedWords[5]
                this.word7 = seedWords[6]
                this.word8 = seedWords[7]
                this.word9 = seedWords[8]
                this.word10 = seedWords[9]
                this.word11 = seedWords[10]
                this.word12 = seedWords[11]
                this.word1 = seedWords[0]

            },
            onPaste(evt) {
                console.log('on paste', evt)
            },
            closeModal() {
                messageBus.$emit('close', 'windowDisplaySeed');
                this.clearup()
            }
        }
    }
</script>
<style>
	ul > li {
		display: inline-block;
		zoom: 1;
		*display: inline;
	}

	.center{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
