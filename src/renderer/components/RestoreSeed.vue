<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background"></div>
		<div class="modal-card" style="width:780px">
			<header class="modal-card-head"  style="background-color: #1e1e2f;">
				<p class="text-white">{{ $t("msg.restore.title") }}</p>

			</header>
			<section class="modal-card-body" style="height:380px; background-color: darkslateblue;">

				<!--				<remove :showModal="openRemove"></remove>-->
				<h1 class="title text-white">{{ $t('msg.restore.title') }}</h1>
				<div v-if="page==='addSeeds'">

					<div class="tabs is-center">
						<b-row>
							<b-col>
								<ul>
									<li :class="[ tabOpen === 'word1' ? 'is-active' : '']">
										<a @click="tabOpen='word1'">
											<input maxlength="5" size="5" class="text-white" style="border: none; background-color: darkslateblue; border-style: none;" v-model="word1" placeholder="" @paste="onPaste">
										</a>
									</li>
									<li :class="[ tabOpen === 'word2' ? 'is-active' : '']"><a
											@click="tabOpen='word2'">
										<input maxlength="5" size="5" class="text-white" style="border: none; background-color: darkslateblue; border-style: none;" v-model="word2" placeholder="" >
									</a></li>
									<li :class="[ tabOpen === 'word3' ? 'is-active' : '']"><a
											@click="tabOpen='word3'">
										<input maxlength="5" size="5" class="text-white" style="border: none; background-color: darkslateblue; border-style: none;" v-model="word3" placeholder="" >
									</a></li>
									<li :class="[ tabOpen === 'word4' ? 'is-active' : '']"><a
											@click="tabOpen='word4'">
										<input maxlength="5" size="5" class="text-white" style="border: none; background-color: darkslateblue; border-style: none;" v-model="word4" placeholder="" >
									</a></li>
									<li :class="[ tabOpen === 'word5' ? 'is-active' : '']"><a
											@click="tabOpen='word5'">
										<input maxlength="5" size="5" class="text-white" style="border: none; background-color: darkslateblue; border-style: none;" v-model="word5" placeholder="" >
									</a></li>
									<li :class="[ tabOpen === 'word6' ? 'is-active' : '']"><a
											@click="tabOpen='word6'">
										<input maxlength="5" size="5" class="text-white" style="border: none; background-color: darkslateblue; border-style: none;" v-model="word6" placeholder="" >
									</a></li>
								</ul>
							</b-col>
							<b-col>
								<ul>
									<li :class="[ tabOpen === 'word7' ? 'is-active' : '']">
										<a @click="tabOpen='word7'">
											<input maxlength="5" size="5" class="text-white" style="border: none; background-color: darkslateblue; border-style: none;" v-model="word7" placeholder="" >
										</a>
									</li>
									<li :class="[ tabOpen === 'word8' ? 'is-active' : '']"><a
											@click="tabOpen='word8'">
										<input maxlength="5" size="5" class="text-white" style="border: none; background-color: darkslateblue; border-style: none;" v-model="word8" placeholder="" >
									</a></li>
									<li :class="[ tabOpen === 'word9' ? 'is-active' : '']"><a
											@click="tabOpen='word9'">
										<input maxlength="5" size="5" class="text-white" style="border: none; background-color: darkslateblue; border-style: none;" v-model="word9" placeholder="" >
									</a></li>
									<li :class="[ tabOpen === 'word10' ? 'is-active' : '']"><a
											@click="tabOpen='word10'">
										<input maxlength="5" size="5" class="text-white" style="border: none; background-color: darkslateblue; border-style: none;" v-model="word10" placeholder="" >
									</a></li>
									<li :class="[ tabOpen === 'word11' ? 'is-active' : '']"><a
											@click="tabOpen='word11'">
										<input maxlength="5" size="5" class="text-white" style="border: none; background-color: darkslateblue; border-style: none;" v-model="word11" placeholder="" >
									</a></li>
									<li :class="[ tabOpen === 'word12' ? 'is-active' : '']"><a
											@click="tabOpen='word12'">
										<input maxlength="5" size="5" class="text-white" style="border: none; background-color: darkslateblue; border-style: none;" v-model="word12" placeholder="" >
									</a></li>
								</ul>
							</b-col>
						</b-row>
					</div>

					<button class="button is-link  is-outlined" @click="page='addPassword'">
						{{ $t('msg.restore.add') }}
					</button>
				</div>

				<div v-else-if="page==='addPassword'">
					<p class="has-text-weight-semibold has-text-warning"
					   style="margin-bottom:12px">
						{{ $t('msg.restore.newPassword') }}
					</p>
					<div class="box" style="width:380px">

						<div class="field">
							<label class="label">{{ $t('msg.password') }}</label>
							<div class="control">
								<input class="input" type="password" placeholder="********" required
									   :class="{'is-warning': errorPassword}" v-model="password">
							</div>
						</div>

						<div class="field">
							<label class="label">{{ $t('msg.passwordAgain') }}</label>
							<div class="control">
								<input class="input" type="password" placeholder="********" required
									   :class="{'is-warning': errorPassword}" v-model="password2">
							</div>
							<p class="help is-warning" v-if="errorPassword">{{errorInfoPassword}}</p>
						</div>

						<div class="field">
							<button class="button is-link" @click="createWallet" >
								{{ $t('msg.restore.recover') }}</button>
							<button class="button is-text" @click="back">
								{{ $t("msg.back") }}</button>
						</div>
					</div>
				</div>

				<div v-else-if="page==='recoverError'">
					<div class="notification is-warning">
						<p>{{recoverErrorInfo}}</p>
					</div>

					<button class="button is-link  is-outlined" @click="page='addSeeds'">
						{{ $t('msg.restore.reAdd') }}
					</button>
				</div>
				<div v-else-if="page==='recovered'">
					<div class="animated bounce has-text-weight-semibold has-text-warning"
						 style="animation-iteration-count:2;margin-bottom:10px">
						<p>{{ $t('msg.restore.recovered') }} </p>
						<p>{{ $t('msg.restore.restoring') }}</p>
					</div>
					<div v-if="restoreOutputs.length > 0">
						<div class="message is-link" style="width:400px">
							<div class="message-body">
								<div class="control">
									<p class="is-size-7" v-for="output in restoreOutputs">{{ output }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-else-if="page==='restored'">
					<p class="animated bounce has-text-weight-semibold has-text-warning is-size-5"
					   style="animation-iteration-count:2;margin-bottom:40px">
						{{ $t('msg.restore.restored') }}
					</p>
					<a class="button is-link  is-outlined" @click="toLogin">{{ $t('msg.restore.login') }}</a>
				</div>


			</section>
		</div>
	</div>

</template>
<script>

    import { messageBus } from '@/messagebus'
    import {version,initWallet} from '../../modules/config'
    const Cryptr = require('cryptr');

    export default {
        name: "RestoreSeed",
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                tabOpen: 'word1',
                currentSeed: '',
                currentSeedInvalid: false,
                enoughSeeds: true,
                seeds:[],
                password: '',
                password2: '',
                total: 12,
                page: 'addSeeds',
                errorPassword: false,
                errorInfoPassword: '',
                recoverErrorInfo: '',
                restoreOutputs: [],
                word1:'',
                word2:'',
                word3:'',
                word4:'',
                word5:'',
                word6:'',
                word7:'',
                word8:'',
                word9:'',
                word10:'',
                word11:'',
                word12:'',
            }
        },
        created(){
        },
        watch: {
            seeds:function(newVal, oldVal){
                if(newVal.length == this.total){
                    this.enoughSeeds = true
                }else{
                    this.enoughSeeds = true
                }
            },
            word1: function (val) {
                //validate word
                this.$log.debug("val: ",val)

                //edge case, if whole seed
                //val = val.split("\n")
                val = val.split(" ")
                this.$log.debug("val2: ",val)
                this.word1 = val[0]
            },
            word12: function (val) {

            }
        },
        beforeDestroy: function(){
            this.showModal = false
        },
        mounted() {

        },
        methods: {
            async createWallet(){
                if(!this.password) throw Error("102:  can't create wallet without seed! ")
                this.$log.debug(this.seeds)


                const cryptr = new Cryptr(this.password);

                //encrypt seeds
                const encryptedString = cryptr.encrypt(this.seeds);
                this.$log.debug('encryptedString: ',encryptedString)

                await initWallet(encryptedString)


				this.closeModal()
                messageBus.$emit('open','windowPassword')
			},
            onPaste (evt) {
                this.$log.debug('on paste', evt)
                this.$log.debug('on paste', evt.clipboardData.getData('Text'))
                let seedWords = evt.clipboardData.getData('Text')
                seedWords = seedWords.split(" ")
                this.$log.debug('seedWords', seedWords)

				for(let i = 0; i < seedWords.length; i++){
				    this.seeds.push(seedWords[i].trim().replace(/\W/g, ''))
				}

                this.word2 = seedWords[1].trim().replace(/\W/g, '')
                this.word3 = seedWords[2].trim().replace(/\W/g, '')
                this.word4 = seedWords[3].trim().replace(/\W/g, '')
                this.word5 = seedWords[4].trim().replace(/\W/g, '')
                this.word6 = seedWords[5].trim().replace(/\W/g, '')
                this.word7 = seedWords[6].trim().replace(/\W/g, '')
                this.word8 = seedWords[7].trim().replace(/\W/g, '')
                this.word9 = seedWords[8].trim().replace(/\W/g, '')
                this.word10 = seedWords[9].trim().replace(/\W/g, '')
                this.word11 = seedWords[10].trim().replace(/\W/g, '')
                this.word12 = seedWords[11].trim().replace(/\W/g, '')
                //this.word1 = seedWords[0]

                this.enoughSeeds = true

                return true
            },
            closeModal() {
                messageBus.$emit('close', 'windowRestoreSeed');
            },
            clearup(){
                this.enoughSeeds = false
                this.currentSeed = ''
                this.currentSeedInvalid = false
                this.seeds = []
                this.password =''
                this.password2 = ''
                this.page = 'addSeeds'
                this.errorPassword = false
                this.errorInfoPassword = ''
                this.recoverErrorInfo = ''

                this.restoreOutputs =[]
            },

            updateOutput(data){
                //let toDel = 'grin_wallet_libwallet::internal::restore'
                //this.restoreOutputs.push(data.replace(toDel, '').replace('WARN', ''))
                this.restoreOutputs.push(data)
            },

            validSeed(seed) {
                let re = /^[A-Za-z]+$/
                return re.test(seed)
            },
            add(){
                if(this.enoughSeeds)return
                let seed = this.currentSeed.trim()
                if(seed === '' || !this.validSeed(seed) ){
                    return this.currentSeedInvalid = true
                }else{
                    this.currentSeedInvalid = false
                    this.seeds.push(seed)
                    this.currentSeed = ''
                }
            },
            resetErrors(){
                this.errorPassword = false;
            },
            delete_(){
                if(this.seeds.length>0)this.seeds.pop()
            },

            back(){
                //this.clearup()
                this.closeModal()
                messageBus.$emit('open','windowWelcome')
            },
            toLogin(){
                //this.clearup()
                messageBus.$emit('restoredThenLogin')
            }
        }
    }
</script>
<style>

	.hz-label-150 div.field-label {
		min-width: 150px;
	}

	.hz-label-200 div.field-label {
		min-width: 200px;
	}

	.hz-label-250 div.field-label {
		min-width: 250px;
	}

	.hz-label-300 div.field-label {
		min-width: 300px;
	}

	.hz-label-150 div.field.is-horizontal,
	.hz-label-200 div.field.is-horizontal,
	.hz-label-250 div.field.is-horizontal,
	.hz-label-300 div.field.is-horizontal
	{
		margin-bottom: 0.75rem;
	}

	#odd-fix ol li {
		display: inline-block;
		width: 100%;
	}

	ol {
		list-style: none;
		counter-reset: my-awesome-counter;
	}
	ol li {
		counter-increment: my-awesome-counter;
	}
	ol li::before {
		content: counter(my-awesome-counter) ". ";
		color: red;
		font-weight: bold;
	}


	ol {
		margin: 0 0 30px 20px;
		columns: 4;
		-webkit-columns: 4;
		-moz-columns: 4;
		column-gap: 30px;
		-webkit-column-gap: 30px;
		-moz-column-gap: 30px;
	}

	ol li {
		margin: 0 0 10px 0;
	}


	.center{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
