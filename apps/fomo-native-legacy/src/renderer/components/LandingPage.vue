<template>


  <div class="section">
    <div class="columns">
      <aside class="column is-2">
        <nav class="menu">
          <p class="menu-label">
            General
          </p>
          <ul class="menu-list">
            <li><a class="is-active">Dashboard</a></li>
            <li><a>Customers</a></li>
          </ul>
          <p class="menu-label">
            Administration
          </p>
          <ul class="menu-list">
            <li><a>Team Settings</a></li>
            <li>
              <a class="">Manage Your Team</a>
              <ul>
                <li><a>Members</a></li>
                <li><a>Plugins</a></li>
                <li><a>Add a member</a></li>
              </ul>
            </li>
            <li><a>Invitations</a></li>
            <li><a>Cloud Storage Environment Settings</a></li>
            <li><a>Authentication</a></li>
          </ul>
          <p class="menu-label">
            Transactions
          </p>
          <ul class="menu-list">
            <li><a>Payments</a></li>
            <li><a>Transfers</a></li>
            <li><a>Balance</a></li>
          </ul>
        </nav>
      </aside>

      <main class="column">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div class="title">Dashboard</div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button type="button" class="button is-small">
                March 8, 2017 - April 6, 2017
              </button>
            </div>
          </div>
        </div>

        <div class="columns is-multiline">
          <div class="column">
            <div class="box">
              <div class="heading">Top Seller Total</div>
              <div class="title">56,950</div>
              <div class="level">
                <div class="level-item">
                  <div class="">
                    <div class="heading">Sales $</div>
                    <div class="title is-5">250,000</div>
                  </div>
                </div>
                <div class="level-item">
                  <div class="">
                    <div class="heading">Overall $</div>
                    <div class="title is-5">750,000</div>
                  </div>
                </div>
                <div class="level-item">
                  <div class="">
                    <div class="heading">Sales %</div>
                    <div class="title is-5">25%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <div class="heading">Revenue / Expenses</div>
              <div class="title">55% / 45%</div>
              <div class="level">
                <div class="level-item">
                  <div class="">
                    <div class="heading">Rev Prod $</div>
                    <div class="title is-5">30%</div>
                  </div>
                </div>
                <div class="level-item">
                  <div class="">
                    <div class="heading">Rev Serv $</div>
                    <div class="title is-5">25%</div>
                  </div>
                </div>
                <div class="level-item">
                  <div class="">
                    <div class="heading">Exp %</div>
                    <div class="title is-5">45%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <div class="heading">Feedback Activity</div>
              <div class="title">78% &uarr;</div>
              <div class="level">
                <div class="level-item">
                  <div class="">
                    <div class="heading">Positive</div>
                    <div class="title is-5">1560</div>
                  </div>
                </div>
                <div class="level-item">
                  <div class="">
                    <div class="heading">Negative</div>
                    <div class="title is-5">368</div>
                  </div>
                </div>
                <div class="level-item">
                  <div class="">
                    <div class="heading">Pos/Neg %</div>
                    <div class="title is-5">77% / 23%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <div class="heading">Orders / Returns</div>
              <div class="title">75% / 25%</div>
              <div class="level">
                <div class="level-item">
                  <div class="">
                    <div class="heading">Orders $</div>
                    <div class="title is-5">425,000</div>
                  </div>
                </div>
                <div class="level-item">
                  <div class="">
                    <div class="heading">Returns $</div>
                    <div class="title is-5">106,250</div>
                  </div>
                </div>
                <div class="level-item">
                  <div class="">
                    <div class="heading">Success %</div>
                    <div class="title is-5">+ 28,5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="columns is-multiline">
          <div class="column is-6">
            <div class="panel">
              <p class="panel-heading">
                Expenses: Daily - $700
              </p>
              <div class="panel-block">
                <figure class="image is-16x9">
                  <img src="https://placehold.it/1280x720">
                </figure>
              </div>
            </div>
          </div>
          <div class="column is-6">
            <div class="panel">
              <p class="panel-heading">
                Refunds: Daily - $200
              </p>
              <div class="panel-block">
                <figure class="image is-16x9">
                  <img src="https://placehold.it/1280x720">
                </figure>
              </div>
            </div>
          </div>
          <div class="column is-6">
            <div class="panel">
              <p class="panel-heading">
                Something
              </p>
              <div class="panel-block">
                <figure class="image is-16x9">
                  <img src="https://placehold.it/1280x720">
                </figure>
              </div>
            </div>
          </div>
          <div class="column is-6">
            <div class="panel">
              <p class="panel-heading">
                Something Else
              </p>
              <div class="panel-block">
                <figure class="image is-16x9">
                  <img src="https://placehold.it/1280x720">
                </figure>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

<!--  <div class="center">-->
<!--    <h2> Fomobot Desktop Dashboard</h2>-->
<!--    <h2>balance: {{total}}</h2>-->
<!--    <button class="button is-text" @click="getSummaryinfo">-->
<!--      {{ $t("msg.update") }}</button>-->

<!--    <br/>-->
<!--    <input v-model="amount" placeholder="amount" >-->
<!--    <br/>-->
<!--    <input v-model="address" placeholder="address" >-->
<!--    <br/>-->
<!--    <button class="button is-text" @click="send">-->
<!--      {{ $t("msg.update") }}</button>-->
<!--  </div>-->
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import { messageBus } from '@/messagebus'

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data(){
      return {
        amount: 0,
        address: '',
        spendable: 0,
        total: 0,
        unconfirmed: 0,
        smallTitle: false
      }
    },
    mounted () {
      this.getSummaryinfo()
    },
    created () {
      messageBus.$on('update', ()=>this.getSummaryinfo())
    },
    methods: {
      getSummaryinfo: function() {
        this.$walletService.getSummaryInfo(10)
          .then( (res) => {
            this.$log.info("res: ",res)
            this.total = res.balance
          }).catch((error) => {
            this.$log.error('getSummaryinfo error:' + error)
            if (error.response) {
              let resp = error.response
              this.$log.error(`resp.data:${resp.data}; status:${resp.status};headers:${resp.headers}`)
            }
        })
      },
      send: function() {
        if(!this.address) throw Error("address required! ")
        if(!this.amount) throw Error("amount required! ")
        this.$walletService.send(this.address,this.amount)
                .then( (res) => {
                  this.$log.info("res: ",res)
                  this.total = res.balance
                }).catch((error) => {
          this.$log.error('getSummaryinfo error:' + error)
          if (error.response) {
            let resp = error.response
            this.$log.error(`resp.data:${resp.data}; status:${resp.status};headers:${resp.headers}`)
          }
        })
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
