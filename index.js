const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors')
require('dotenv').config()
const app=express();
const port =process.env.PORT||5000;

//middleware
app.use(cors())
app.use(express.json())
// const uri = `mon//godb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dnwfd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bl05f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
    try{
    await client.connect();
    console.log('connected')
    const database=client.db('Travellia');
    const servicesCollection=database.collection('services')
    const orderCollection=database.collection('orders')
    //get api
    app.get('/services',async(req,res)=>{
        const cursor=servicesCollection.find({});
        const services=await cursor.toArray();
        res.send(services);
    })

    //get signle service

    app.get('/services/:id',async(req,res)=>{
        const id =req.params.id;
        // console.log('specific service',id)
        const query={_id:ObjectId(id)};
        const service=await servicesCollection.findOne(query);
        res.json(service);
    })
    
    //post api(services)
    app.post('/services',async(req,res)=>{
        const service=req.body;
        console.log('hit the post api',service)
        const result=await servicesCollection.insertOne(service);
        console.log(result)
        res.json(result)
    });
     
    
    //get api(order)
    app.get('/orders',async(req,res)=>{
        const cursor=orderCollection.find({});
        const orders=await cursor.toArray();
        res.send(orders);
    })

    app.post('/orders',async(req,res)=>{
         const order=req.body;
        console.log('hit the post api',order)
        const result=await orderCollection.insertOne(order);
        console.log(result)
        res.json(result)
       
    });

    // update api
    app.get('/orders/:id',async(req,res)=>{
        const id= req.params.id;
        const query ={_id:ObjectId(id)};
        const newQuery={$set:{status:'approved'}}
        const result = await orderCollection.updateOne(query, newQuery);
        console.log('load user with id :',id)
        res.json(result)
    })

    //delete api(order)
    app.delete('/orders/:id',async(req,res)=>{
        const id = req.params.id;
        const query={_id: ObjectId(id)};
        const result =await orderCollection.deleteOne(query);
        console.log("deleting user with id",result);
        res.json(result)
    })
    }
    finally{
    //   await client.close();
    }
}

run().catch(console.dir)
app.get('/',(req,res)=>{
    res.send('Running the server');
})

app.listen(port,()=>{
    console.log('running the server on port',port);
})