
    var FCM = require('fcm-node');
    var serverKey = 'AAAAmRFrm_o:APA91bE-NX4kxhhzuaPKgRu5j5cfqzSb_PPtC8oQKam5vM-Mxh4GdrHs-j5BOVTHUNdMESMYs5evmngtGWNXnBt2wJ57dGmYoBLUZ2Cv8rRSQNKJemfCaB_jB73fh4r4FyXunO2pHRSh';
    var fcm = new FCM(serverKey);

    var message = {
	to:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjA2MDljZGM4YzU4OTc1NTIyNjQ4NjIiLCJpYXQiOjE2NDQ2NjcwNjR9.zB7z2zoOX1u6I9UMpITVskBo_p0PSLBZzvqGyj8vFSo',
        notification: {
            title: 'NotifcatioTestAPP',
            body: '{"Message from node js app"}',
        },

        data: { //you can send only notification or only data(or include both)
            title: 'ok cdfsdsdfsd',
            body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
        }

    };

    fcm.send(message, function(err, response) {
        if (err) {
            console.log("Something has gone wrong!"+err);
			console.log("Respponse:! "+response);
        } else {
            // showToast("Successfully sent with response");
            console.log("Successfully sent with response: ", response);
        }

    });