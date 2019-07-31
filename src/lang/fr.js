const messages = {
    msg: {
        title: 'DiagonAlley Portefeuille',
        password: 'Mot de passe',
        passwordAgain: 'Entrez le mot de passe à nouveau',
        wrongPassword: 'Mauvais mot de passe',
        login_: 'Se connecter',
        logout: 'Se déconnecter',
        search: 'Chercher',
        clearup: 'Nettoyer',
        jump: 'Saut',

        confirmed: 'Confirmé',
        unconfirmed: 'Non confirmé',
        locked: 'Fermé à clef',

        send: 'Envoyer',
        receive: 'Recevoir',

        //modal
        passwordTitle:"Tapez votre mot de passe",
        registerTitle:"Créer un nouveau nom d'utilisateur!",

        cancel:'Annuler',
        save: 'Sauvegarder',

        welcome: 'Bienvenue à DiagonAlley.io',
        back: 'Retour',
        msg: 'Message',
        more: 'Plus',

        register:{
            unavailable: 'Le nom d utilisateur est indisponible!',
            missing:"Le nom d'utilisateur n'est pas défini!",
            fail:"Échec de l'inscription! Essayez un nouveau nom! ",
            title: "Sélectionnez un nom d'utilisateur",
            available: "Ce nom d'utilisateur est disponible",
            random: "Nom d'utilisateur aléatoire",
            submit: "Soumettre",
        },

        login: {
            walletExist: 'Portefeuille GRIN trouvé! Se connecter avec mot de passe original :-)',
        },

        remove:{
            title: 'Supprimer le portefeuille actuel',
            warning: 'Attention!',
            info: "Avant de supprimer le portefeuille actuel, assurez-vous qu'il n'y a pas de GRIN dans ce portefeuille ou écrivez le phrase de graine (seed phrase)!",
            help: 'Entrez "retirer" dans la zone de saisie ci-dessous pour confirmer',
            remove: 'Retirer',
            success: 'Le portefeuille actuel a été retiré. Cliquez sur "OK" pour redémarrer le portefeuille.'
        },

        create:{
            title: ' Create a new Wallet! ',
            seedPhrase: 'Phrase de graine (Seed Phrase)',
            toNewMsg: 'Aucun portefeuille trouvé. Créer un nouveau.',
            newWallet: 'Créer un nouveau portefeuille',
            backupNote: 'Important！Sauvegardez le phrase de graine pour restaurer votre portefeuille',
            backupFinish: "D'accord, J'ai sauvegardé mon phrase de graine. Se connecter à mon portefeuille",
            errorPasswdEmpty: 'Le mot de passe ne peut pas être vide',
            errorPasswdConsistency: "S'il vous plaît entrer le même mot de passe",
            errorCreateFailed: "Erreur lors de la tentative de création d'un nouveau portefeuille. Redémarrez le portefeuille ou réessayez plus tard.",
        },

        new_:{
            create: 'Créer un nouveau portefeuille',
            restore: 'Restaurer le portefeuille via phrase de graine (Seed Phrase)',
            import: 'importer le fichier de sauvegarde du portefeuille'
        },

        restore:{
            seedPhrase: 'Phrase de graine (Seed Phrase)',
            title: 'Restaurer le portefeuille via phrase de graine (Seed Phrase)',
            addSeedsInfo: "Ajouter Phrase de graine (Seed Phrase) un par un s'il vous plait",
            add: 'Ajouter',
            invalid: 'Phrase de graine invalide',
            delete: 'Effacer',
            added: "Fini d'entrer Phrase de graine (Seed Phrase)",
            newPassword: 'Définir un nouveau mot de passe',
            recover: 'Récupérer',
            reAdd: 'Entrez Phrase de graine (Seed Phrase) une autre fois',
            recovered: "Portefeuille récupéré, il est temps de vérifier le solde de GRIN blockchain",
            restoring: "Cela prendra 10-30 minutes pour terminer. Sois patient s'il te plait ......",
            restored: 'Portefeuille récupéré et solde vérifié.',
            login: 'Login Portefeuille',
        },

        app:{
            current: 'Actuel',
            available: 'Disponible',
            create: 'Créer un fichier de transaction',
            finalize: 'Finaliser',
            httpSend: 'Envoyer via http/https',
            createRespFile: 'Créer un fichier de transaction de réponse',
            httpReceive: "Ouvrir l'écoute HTTP (http listener) à recive",
            height:'La taille',
            updateTitle: 'Trouvé nouvelle version',
            updateMsg: 'Trouvé nouvelle version de DiagonAlley Portefeuille. Veuillez mettre à jour!',
            yes: 'oui',
            no: 'non',
            hedwig: 'Recevoir via Hedwig'
        },

        info: {
            spendable: 'Dépensable',
            total: 'Total',
            unfinalization: 'Définalisant',
            immature: 'Immature'
        },

        txs:{
            tx: 'Transactions',
            canceled:'Annulé',
            noTxFound: 'Aucune transaction trouvée',
            noTx:'Aucune transaction',
            cancelSuccess:'Cette transaction a été annulée',
        },

        commit:{
            unspentCmt: 'La production non dépensé commettre',
            heightCreated: 'Hauteur du bloc lors de sa création',
            unspent: 'Non dépensé',
            spent: 'Dépensé',
            noCmtFound: 'Production non dépensée introuvable',
            noCmt:'Non Production non dépensée Commettre',
            copied: 'Copié'
        },

        fileSend:{
            sendAmount: 'Montant à envoyer',
            createTxFile: 'Créer un nouveau fichier de transaction',
            WrongAmount: 'Mauvais montant',
            saveMsg: 'Enregistrez le fichier de transaction créé',
            CreateFailed: 'A échoué à créer nouveau fichier de transaction',
            NotEnough: 'Montant trop bas. Conserver au moins 0,01 en tant que frais'
        },

        httpSend:{
            sendAmount: 'Montant à envoyer',
            address:'Adresse',
            WrongAmount: 'Mauvais montant',
            NotEnough: 'Montant trop bas. Conserver au moins 0,01 en tant que frais',
            WrongAddress: 'Mauvaise adresse',
            WrongTxData: 'Échec de la construction de la transaction',
            success: 'Succès de la transaction',
            TxFailed: "La transaction d'envoi a échoué",
            TxResponseFailed: "Impossible d'obtenir une réponse correcte du destinataire",
            TxCreateFailed: 'La transaction de création a échoué',
            salteVersion: 'Version du fichier Slate',
            salteVersionHelp: 'Si vous ne parvenez pas à envoyer GRIN, essayez de changer la version du fichier Slate puis renvoyez'
        },

        fileReceive: {
            dropMsg: 'Déposer le fichier de transaction reçu',
            WrongFileType: 'Type de fichier de transaction incorrect',
            saveMsg: 'Enregistrer fichier de transaction de réponse créé',
            CreateFailed: 'Échec de la création du nouveau fichier de transaction de réponse',
            NoSavePlace: 'Veuillez choisir le lieu de sauvegarde',
        },

        finalize: {
            finalize: 'Finaliser',
            success: 'Transcation success',
            ok:"D'accord",
            sending: 'Envoi',
            dropMsg: 'Goutte fichier de transaction de réponse à finaliser',
            WrongFileType: 'Type de fichier de transaction incorrect',
            TxFailed: 'La transaction a échoué',
        },

        httpReceive: {
            launchSucess: 'Started successful',
            listening: "L'écoute HTTP (HTTP Listener) du portefeuille est en cours d'exécution",
            address: 'Adresse du portefeuille',
            reachableMsg2: "Assurez-vous que votre adresse IP est accessible par l'internaute",
            close: 'Arrêtez écoute',
            attention: 'Attention',
            reachableMsg: "Pour démarrer L'écoute HTTP, vous devez avoir une adresse IP publique, accessible par l'internaute.",
            password: "Mot de passe portefeuille (utilisé pour démarrer l'écoute HTTP )",
            start: 'Début',
            error: 'Pas de mot de passe.',
            failed: 'Échec du démarrage, vérifier le mot de passe',
            failed2: "L'écoute HTTP a échoué, votre adresse IP publique ne peut pas être atteinte par l'internaute. Essayez le fichier de transaction ou Hedwig.",
            failed3: "Impossible d'obtenir votre adresse IP publique; Réessayez plus tard",
            failed4: "Localhost l'écoute HTTP est en cours d'exécution (http://127.0.0.1:3415) mais votre adresse IP publique ne peut pas être atteinte par l'internaute. Essayez le fichier de transaction ou Hedwig.",
            ip: 'Votre adresse IP publique'
        },

        hedwig: {
            title: 'Recevoir via Hedwig(v1)',
            launchSucess: 'Commencé avec succès',
            reachable: "Hedwig l'adresse est disponible",
            address: 'Adresse de réception',
            tip: "S'il vous plaît garder le portefeuille en ligne.",
            close: 'Arrêtez Hedwig',
            introTitle: 'Introduction',
            intro1: 'Hedwig(v1) est un service de relais pour les utilisateurs sans IP publique. Il fournit une adresse temporaire pour recevoir GRIN.',
            intro2: "Quand quelqu'un envoie GRIN à l'adresse, Hedwig (v1) transmettra la demande à votre portefeuille. Donc, vous aurez votre GRIN.",
            start: 'Début',
            failed: 'Erreur de connexion au serveur Hedwig, réessayez plus tard.',
            failed2: "Erreur lors du test de l'adresse Hedwig, réessayez ultérieurement ou redémarrez le portefeuille.",
            failed3: 'Impossible de démarrer le service de réception GRIN local, réessayez ultérieurement ou redémarrez le portefeuille.',
            copy: 'Adresse de copie',
            copied: "L'adresse a été copiée dans le presse-papier"
        },

        check: {
            title: 'Vérifier le solde',
            checking: 'Vérification, soyez patient ...',
            stop: 'Arrêter de vérifier',

            tip:'Il faudra 10-30 minites pour finir de vérifier',
            introTitle: 'Introduction',

            intro1: "En raison de toutes les possibilités énumérées dans la commande d'annulation, ainsi que de la possibilité d'utiliser des fourchettes, il est tout à fait possible que votre portefeuille se retrouve dans un état incohérent.",
            intro2: "Pour cette raison, GRIN fournit une commande de vérification manuelle qui analyse l'ensemble UTXO de la chaîne à la recherche de sorties appartenant à votre portefeuille et s'assure qu'elles sont dans un état cohérent avec votre base de données de portefeuille locale..",

            start: 'Début',
            stopCheckMsg: 'Le chèque a été annulé',
            checkedMsg: 'Solde de vérification terminé'
        },

        lang: {
            title: 'Choisir la langue',
            lang: 'La langue',
            select: 'Choisir'
        }

    }
}
export default messages

