export const paypalButtonsComponent = paypal.Buttons({
    
    // finalize the transaction
    onApprove: (data, actions) => {
        const captureOrderHandler = (details) => {
            const payerName = details.payer.name.given_name;

            
            var x = "Success"
            
        };

        return actions.order.capture().then(captureOrderHandler);
    },
    

    // handle unrecoverable errors
    onError: (err) => {
        var x="Failed"
        notiPop(x);
        console.log(err)

    }
});

