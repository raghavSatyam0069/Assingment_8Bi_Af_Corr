let express = require("express");

let app = express();

app.use(express.json());

app.use(function (req, res, next) {

res.header("Access-Control-Allow-Origin","*");

res.header(

"Access-Control-Allow-Methods",

"GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"

);

res.header(

"Access-Control-Allow-Headers",

"Origin, X-Requested-With, Content-Type, Accept"

);

next();

});

var port=process.env.port || 2410;
app.listen(port, () => console.log(`Listening on port ${port}!`));
let {data}=require("./assignment8B.js");
let {products,purchases,shops}=data;
let fs=require("fs");
let fname="ShopsData.json";

app.get("/resetData",function(req,res){
    let str=JSON.stringify(data);
    fs.writeFile(fname,str,function(err,){
        if(err)res.status(404).send(err);
        else{
            res.send("Data is reset");
        }
    })
});

app.get("/purchases/shops/:id",function(req,res){
    let id=+req.params.id;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let purchasesData=JSON.parse(data).purchases;
            let arr=purchasesData.filter(k=>k.shopId===id);
    if(!arr)res.status(404).send("No Data Found");
    else{
        
           res.send(arr);    
    }
        }
    });
    
});
app.get("/purchases/products/:id",function(req,res){
    let id=+req.params.id;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let purchasesData=JSON.parse(data).purchases;
            let arr=purchasesData.filter(k=>k.productid===id);
    if(!arr)res.status(404).send("No Data Found");
    else{
           res.send(arr);
    }
        }
    }); 
});
app.get("/totalPurchase/shop/:stId",function(req,res){
    let id=+req.params.stId;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let purchasesData=JSON.parse(data).purchases;
            let arr=purchasesData.filter(k=>k.shopId===id);
            // console.log(arr.length);
            let totalPurchase=arr.reduce((acc,curr)=>acc+curr.quantity,0);
            let obj={shopId:id,totalPurchase:arr.length,totalQuantity:totalPurchase}
    if(!arr)res.status(404).send("No Data Found");
    else{
           res.send(obj);
    }
        }
    }); 
});
app.get("/totalPurchase/product/:prId",function(req,res){
    let id=+req.params.prId;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let purchasesData=JSON.parse(data).purchases;
            let arr=purchasesData.filter(k=>k.productid===id);
            let totalPurchase=arr.reduce((acc,curr)=>acc+curr.quantity,0);
            let obj={productid:id,totalPurchase:arr.length,totalQuantity:totalPurchase}
    if(!arr)res.status(404).send("No Data Found");
    else{
           res.send(obj);
    }
        }
    }); 
});
app.get("/shops",function(req,res){
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let shopsData =JSON.parse(data).shops;
            res.send(shopsData);
        }
    }); 
});
app.get("/allData",function(req,res){
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let allData =JSON.parse(data);
            res.send(allData);
        }
    }); 
});
app.get("/products/:prodName",function(req,res){
    let productName=req.params.prodName;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let productsData =JSON.parse(data).products;
            let product=productsData.find(k=>k.productName===productName);
            res.send(product);
        }
    });
    
});
app.get("/products",function(req,res){
    let city=req.query.city;
    let gender=req.query.gender;
    let payment=req.query.payment;
    let sortBy=req.query.sortBy;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let productsData =JSON.parse(data).products;
            res.send(productsData);
        }
    });
    
});
app.get("/purchases",function(req,res){
    let shopId=req.query.shop;
    let productIds=req.query.product?req.query.product.split(","):"";
    let sort=req.query.sort;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let purchasesData =JSON.parse(data).purchases;
              if(shopId){
        purchasesData=purchasesData.filter(k=>`st${k.shopId}`===shopId);
    }
    if(productIds){
        purchasesData=purchasesData.filter(k=>productIds.find(j=>j==`pr${k.productid}`));
    }
    if(sort){
        if(sort==="QtyAsc"){
         purchasesData=purchasesData.sort((c1,c2)=>+c1.quantity-(+c2.quantity));
        }
        else if(sort==="QtyDesc"){
          purchasesData=purchasesData.sort((c1,c2)=>+c2.quantity-(+c1.quantity));
        }
        else if(sort==="ValueAsc"){
          purchasesData=purchasesData.sort((c1,c2)=>+c1.quantity*c1.price-(+c2.quantity*c2.price));
        }
        else if(sort==="ValueDesc"){
         purchasesData=purchasesData.sort((c1,c2)=>+c2.quantity*c2.price-(+c1.quantity*c1.price));
        }
    }
            res.send(purchasesData);
        }
    }); 
});
app.post("/purchases" ,function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let obj=JSON.parse(data);
            let maxId=obj.purchases.reduce((acc,curr)=>acc>curr.purchaseId? acc+1:curr.purchaseId+1,0);
            obj.purchases.push({...body,purchaseId:maxId});
            let str=JSON.stringify(obj);
            fs.writeFile(fname,str,function(err){
                if(err)res.status(404).send(err);
                else{
                    res.send({...body,purchaseId: maxId});
                }
            })
        }
    });
});
app.post("/products" ,function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let obj=JSON.parse(data);
            let maxId=obj.products.reduce((acc,curr)=>acc>curr.productId? acc+1:curr.productId+1,0);
            obj.products.push({productId:maxId,...body});
            console.log(obj);
            let str=JSON.stringify(obj);
            fs.writeFile(fname,str,function(err){
                if(err)res.status(404).send(err);
                else{
                    res.send({productId: maxId,...body});
                }
            })
        }
    })
});
app.post("/shops" ,function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let obj=JSON.parse(data);
            let maxId=obj.shops.reduce((acc,curr)=>acc>curr.shopId? acc+1:curr.shopId+1,0);
            obj.shops.push({...body,shopId:maxId});
            let str=JSON.stringify(obj);
            fs.writeFile(fname,str,function(err){
                if(err)res.status(404).send(err);
                else{
                    res.send({...body,shopId: maxId});
                }
            })
        }
    })
});
app.put("/shops/:shopId" ,function(req,res){
    let shopId=+req.params.shopId;
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
        let customersData=JSON.parse(data);
        let index=customersData.findIndex(k=>k.id===id);
        if(index<0)res.status(404).send("No Data Found");
        else{
        let updatedStudent={id:id,...body};
        customersData[index]=updatedStudent;
        let str=JSON.stringify(customersData);
        fs.writeFile(fname,str,function(err,data){
            if(err)res.status(404).send(err);
            else{
             res.send(updatedStudent);
            }
        })
    }
        }
    })
});
app.put("/products/:id" ,function(req,res){
    let productId=+req.params.id;
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
        let obj=JSON.parse(data);
        let index=obj.products.findIndex(k=>k.productId===productId);
        if(index<0)res.status(404).send("No Data Found");
        else{
        let updatedProd={productId:productId,...body};
        obj.products[index]=updatedProd;
        let str=JSON.stringify(obj);
        fs.writeFile(fname,str,function(err,data){
            if(err)res.status(404).send(err);
            else{
             res.send(updatedProd);
            }
        }); 
    }
        }
    })
});
app.put("/shops/:shopId" ,function(req,res){
    let shopId=+req.params.shopId;
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
        let customersData=JSON.parse(data);
        let index=customersData.findIndex(k=>k.id===id);
        if(index<0)res.status(404).send("No Data Found");
        else{
        let updatedStudent={id:id,...body};
        customersData[index]=updatedStudent;
        let str=JSON.stringify(customersData);
        fs.writeFile(fname,str,function(err,data){
            if(err)res.status(404).send(err);
            else{
             res.send(updatedStudent);
            }
        })
        
        
    }
        }
    })
   
});
app.delete("/shops/:shopId" ,function(req,res){
   let shopId=+req.params.shopId;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let obj=JSON.parse(data);
    let index=obj.shops.findIndex(k=>k.shopId===shopId);
    if(index<0)res.status(404).send("No Data Found");
    else{
        let delShop= obj.shops.splice(index,1);
        let str=JSON.stringify(obj);
        fs.writeFile(fname,str,function(err){
            if(err)res.status(404).send(err);
            else{
        res.send(delShop);
            }
        })
    }
        }
    })
});
app.delete("/purchases/:id" ,function(req,res){
   let id=+req.params.id;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let obj=JSON.parse(data);
    let index=obj.purchases.findIndex(k=>k.purchaseId===id);
    if(index<0)res.status(404).send("No Data Found");
    else{
        let delPurchase= obj.purchases.splice(index,1);
        let str=JSON.stringify(obj);
        fs.writeFile(fname,str,function(err){
            if(err)res.status(404).send(err);
            else{
        res.send(delPurchase);
            }
        })
    }
        }
    })
});
