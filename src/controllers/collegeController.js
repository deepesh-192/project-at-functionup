const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')


// CREATE COLLEGE

const createCollege = async function (req, res) {
try{
    let { name, fullName, logoLink } = req.body

    if (Object.keys(req.body).length == 0)return res.status(400).send({status:false,msg:"please enter a data in request body"})
    
    if (!name)return res.status(400).send({status:false,msg:"Name is missing"})

    if (typeof name !== "string")return res.status(400).send({ status: false, msg: " Please enter  name as a String" });

    if (!/^\w[a-zA-Z.\s]*$/.test(name))return res.status(400).send({ status: false, msg: "The  name may contain only letters" });

    if (!fullName)return res.status(400).send({status:false,msg:"fullName is missing"})

    if (typeof fullName !== "string")return res.status(400).send({ status: false, msg: " Please enter  fullName as a String" });

    if (!/^\w[a-zA-Z.\s]*$/.test(fullName))return res.status(400).send({ status: false, msg: "The  fullName may contain only letters" });

    if (!logoLink) return res.status(400).send({status:false,msg:"please enter logo link"})

    if (typeof logoLink !== "string")return res.status(400).send({ status: false, msg: " Please enter  logoLink as a String" });

    if (!/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+(png|jpg|jpeg|gif|png|svg)$/.test(logoLink))return res.status(400).send({ status: false, msg: "Please enter valid logo link" });

    let uniqueName = await collegeModel.findOne({ name: name })

    if (uniqueName) return res.status(400).send({ status: false, msg: "This name already exists" })

    let saveData=await collegeModel.create(req.body)
    return res.status(201).send({status:true,msg:"College is created Successfully",data:saveData,})

}catch(err){return res.status(500).send({status:false,msg:err.message})}
}



// GET COLLEGE DETAILS

const getCollegeDetail = async function (req,res) {

    try {
        let query =req.query;
      
        if(Object.keys(query).length === 0) return res.status(400).send({status:false,msg:"pls Enter Query"})

        if(!(Object.keys(query).includes("collegeName"))) return res.status(400).send({status:false,msg:`You cant find this Query`})

        query.collegeName = query.collegeName.toLowerCase() 

        let collegeDetail = await collegeModel.findOne({name:query.collegeName});

        if(!collegeDetail)  return res.status(404).send({status:false,msg:`${query.collegeName} is not present .`})

        let intern = await internModel.find({collegeId:collegeDetail._id,isDeleted:false}).select({name:1,email:1,mobile:1});

        if(intern.length === 0)  return res.status(404).send({status:false,msg:"intern is not found ."})

        let {name,fullName,logoLink} = collegeDetail
       // let name=collegeDetail.name

        return res.status(200).send({status:true, data:{name,fullName,logoLink,intern}})
        
    } catch (error) {return res.status(500).send({status:false,msg:error.message})}

}




module.exports.createCollege=createCollege;
module.exports.getCollegeDetail=getCollegeDetail;