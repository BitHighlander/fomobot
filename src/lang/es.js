const messages = {
    msg: {
        title: 'DiagonAlley Billetera',
        password: 'Contraseña',
        passwordAgain: 'Ingrese de nuevo la contraseña',
        wrongPassword: 'Contraseña incorrecta',
        login_: 'Iniciar sesión',
        logout: 'Cerrar sesión',
        search: 'Buscar',
        clearup: 'Aclarar',
        jump: 'Saltar',
        confirmed: 'Confirmado',
        unconfirmed: 'Inconfirmado',
        locked: 'Bloqueado',

        send: 'Enviar',
        receive: 'Recibir',

        //modal
        passwordTitle:"Ingrese su contraseña de carteras",
        registerTitle:"Crear nuevo nombre de usuario",

        cancel:'Cancelar',
        save: 'Salvar',

        welcome: 'Bienvenido a DiagonAlley.io',
        back: 'Espalda',
        msg: 'Mensaje',
        more: 'Más',

        register:{
            unavailable: 'Username is Unavailable!',
            missing:'Username is undefined!',
            fail:"Failed to register! try a new name! ",
            title: "this is a title",
            available: "this username is avaible",
            random: "random username",
        },

        login: {
            walletExist: 'Encontró la billetera de grin! Iniciar sesión con contraseña original :-)',
        },

        remove:{
            title: 'Quitar Billetera Actual',
            warning: 'Advertencia !',
            info: 'Antes de retirar la billetera actual, asegúrate de que no hay nada en esta billetera o escribes la frase de la semilla!',
            help: 'Introduzca "eliminar" en el cuadro de entrada a continuación para confirmar',
            remove: 'retirar',
            success: 'Se quitó la billetera actual. Haga clic en "Aceptar" para reiniciar la cartera.'
        },

        create:{
            title: ' Create a new Wallet! ',
            seedPhrase: 'Frase de semillas',
            toNewMsg: 'No hay billetera encontrada. Crear uno nuevo.',
            newWallet: 'Crear nueva billetera',
            backupNote: 'Importante！Por favor, copia de seguridad de su frase semilla para restaurar su billetera',
            backupFinish: 'Ok, he guardado mi frase semilla.. Iniciar sesión en mi billetera',
            errorPasswdEmpty: 'La contraseña no puede estar vacía',
            errorPasswdConsistency: 'Por favor ingrese la misma contraseña',
            errorCreateFailed: 'Error al intentar crear nueva billetera. Tal vez reinicie billetera y pruébelo más tarde.',
        },

        new_:{
            create: 'Crear nueva billetera',
            restore: 'Restaurar billetera a través de la frase semilla',
            import: 'Importar archivo de copia de seguridad de billetera'
        },

        restore:{
            seedPhrase: 'Frase de semillas',
            title: 'Restaura la billetera de la frase semilla',
            addSeedsInfo: 'Añadir la frase semilla una por una por favor',
            add: 'Añadir',
            invalid: 'Inválido frase de semillas',
            delete: 'Borrar',
            added: 'Terminar entrar frase de semillas',
            newPassword: 'Establecer una nueva contraseña',
            recover: 'Recuperar',
            reAdd: 'Volver a entrar en frase de semillas',
            recovered: 'Billetera recuperada, es hora de consultar saldo de Grin blockchain',
            restoring: 'Tardará 10-30 minutos en terminar. Se paciente ......',
            restored: 'Billetera recuperada y saldo comprobado..',
            login: 'Iniciar sesión billetera',
        },

        app:{
            create: 'Crear transacción expediente',
            finalize: 'Finalizar',
            httpSend: 'Enviar a través de http/https',
            createRespFile: 'Crear respuesta la operación expediente',
            httpReceive: 'Abierto http oyente para recibir',
            height:'Altura',
            updateTitle: 'Nueva versión encontrada',
            updateMsg: 'Nueva versión encontrada de billetera DiagonAlley. Por favor actualice!',
            yes: 'sí',
            no: 'no',
            hedwig: 'Recibir vía Hedwig'
        },

        info: {
            spendable: 'Gastable',
            total: 'Total',
            unfinalization: 'Desfinalización',
            immature: 'Inmadura'
        },

        txs:{
            tx: 'Actas',
            canceled:'Cancelado',
            noTxFound: 'No se encontraron transacciones',
            noTx:'Sin transacciones',
            cancelSuccess:'Esta transaccion cancelada',
        },

        commit:{
            unspentCmt: 'Salida sin gastar cometer',
            heightCreated: 'Altura del bloque cuando se crea',
            unspent: 'No gastado',
            spent: 'Gastado',
            noCmtFound: 'No "Unspent Output" encontró',
            noCmt:'No "Unspent Output" cometer',
            copied: 'Copiado'
        },

        fileSend:{
            sendAmount: 'Cantidad a enviar',
            createTxFile: 'Crear nuevo transacción expediente',
            WrongAmount: 'Cantidad incorrecta',
            saveMsg: 'Guardar el archivo de transacción creado',
            CreateFailed: 'Failed to create new transcation file',
            NotEnough: 'Cantidad demasiado baja. Mantener 0.01 como una tarifa'
        },

        httpSend:{
            sendAmount: 'Amount to send',
            address:'Address',
            WrongAmount: 'Wrong amount',
            NotEnough: 'Not enough amount. Keep 0.01 as fee',
            WrongAddress: 'Wrong address',
            WrongTxData: 'Failed to build transaction',
            success: 'Transcation success',
            TxFailed: 'Send transcation failed',
            TxResponseFailed: 'Failed to get right respose from receiver',
            TxCreateFailed: 'Create transcation failed',
            salteVersion: 'Slate file version',
            salteVersionHelp: 'If you failed to send grin, try change the Slate file version then resend'
        },

        fileReceive: {
            dropMsg: 'Drop transaction file received',
            WrongFileType: 'Wrong transaction file type',
            saveMsg: 'Save response transaction file created',
            CreateFailed: 'Failed to create new response transcation file',
            NoSavePlace: 'Please choose the location to save',
        },

        finalize: {
            finalize: 'Finalize',
            success: 'Transcation success',
            ok:'OK',
            sending: 'Sending',
            dropMsg: 'Drop response transaction file to finalize',
            WrongFileType: 'Wrong transaction file type',
            TxFailed: 'transcation failed',
        },

        httpReceive: {
            launchSucess: 'Started successful',
            listening: "Wallet's HTTP listen is running",
            address: 'Wallet Address',
            reachableMsg2: 'Make sure your ip is reachable by internet user',
            close: 'Stop listen',
            attention: 'Attention',
            reachableMsg: 'To start HTTP listen, you should have public ip, which is reachable by internet user.',
            password: 'Wallet Password (used to start HTTP listen)',
            start: 'Start',
            error: 'No password.',
            failed: 'Start Failed, Maybe wrong password',
            failed2: 'HTTP listen failed, your public ip could not reachable by internet user. Try trascation file Or Hedwig.',
            failed3: 'Failed to get your public ip; try it later',
            failed4: 'Localhost http listen is running(http://127.0.0.1:3415). Howerver, your public ip could not reachable by internet user. Try trascation file Or Hedwig.',
            ip: 'your public ip'
        },

        hedwig: {
            title: 'Receive via Hedwig(v1)',
            launchSucess: 'Started successful',
            reachable: 'Hedwig address is available',
            address: 'Address to receive',
            tip:'Please keep wallet online.',
            close: 'Stop Hedwig',
            introTitle: 'Introduction',
            intro1: 'Hedwig(v1) is a relay service for users without a public ip. It provides a temporary address to receive grin.',
            intro2: 'When someone send grin to the address, Hedwig(v1) will forward the send request to your wallet. So you will get your grin.',
            start: 'Start',
            failed: 'Error when try to connect Hedwig server, try it latter maybe',
            failed2: 'Error when test Hedwig address, try it later maybe or restart wallet.',
            failed3: 'Failed to start local grin receive service, try it later maybe or restart wallet.',
            copy: 'copy address',
            copied: 'address was copied in clipboard'
        },

        check: {
            title: 'Check Balance',
            checking: 'Checking, be patient ...',
            stop: 'Stop Check',

            tip:'It will take 10-30 minites to finish check',
            introTitle: 'Introduction',

            intro1: 'Because of all of the possibilities listed in the cancel command, as well as the possibility of forks, it is quite possible for your wallet to end up in an inconsistent state',
            intro2: "For this reason, Grin provides a manual check command that scans the chain's UTXO set for any outputs belonging to your wallet, and ensures they're in a consistent state with your local wallet database.",

            start: 'Start',
            stopCheckMsg: 'Check was cancelled',
            checkedMsg: 'Check balance finished'
        },

        lang: {
            title: 'Select Language',
            lang: 'Language',
            select: 'Select'
        }

    }
}
export default messages
