const config = require("../config");

//console.log(config)
// web3.eth.getTransactionCount("0x9B5d4472ea7B03a47604A71b62238600Db06fb9c").then(function(resultnone){
//   var nonce=parseInt(resultnone);

async function test2(){
//  setInterval(function(){
      var resultnonce = await config.web3.eth.getTransactionCount(config.controller)
      while(true){
        await sleep(3000);

           console.log("nonce:"+resultnonce);
          config.client.LLEN("Betdata",function(errllen,resllen){
            console.log("resllen:",resllen);
            for (var i = 0; i < resllen; i++) {
              try{
                config.client.rpop("Betdata",function(err,datas){
                  // console.log('test-------',this);
                  console.log('========',resultnonce);
                  if(datas!=null){
                    config.web3.eth.accounts.signTransaction({
                      to: config.contract1,
                      data: JSON.parse(datas).data,
                      gas: 1500000,
                      nonce:resultnonce++
                    },config.privatekey,function(errsig,resultsig){
                      if(!errsig){
                        config.web3.eth.sendSignedTransaction(resultsig.rawTransaction,function(beterr,betresult){
                          if(!beterr){
                            let id = JSON.parse(datas).id;
                            let type = JSON.parse(datas).type;
                            console.log(type);
                            if(type=='bet'){
                              config.db.actorDetail.update({"_id":id},{"txthash01":betresult,"status":2036}).then(function(re){
                                console.log("re:",re);
                              })
                            }else  if(type=="betsettle"){
                              config.db.actorDetail.update({"_id":id},{"txthash02":betresult,"status":2037}).then(function(re){
                                console.log("re:",re);
                              })
                            }else{
                              config.db.deposithistory.update({"_id":id},{"txthash02":betresult,"status":2036}).then(function(re){
                                console.log("re:",re);
                              })
                            }
                          }else{
                            console.log("bet err",beterr);
                          }
                        });
                      }else{
                        console.log("bet err",errsig);
                      }
                   });
                 }
               }.bind(this))
              }catch(e){
                console.log("e",e);
              }
            }
          }.bind(this))

      }
}
function sleep(time = 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    })
  }

test2();
