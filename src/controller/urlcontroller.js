
const urlModel = require("../model/urlmodel")
const urlvalidation = require("url-validation")
const shortid = require("shortid")

const isValidRequest = function (request) {
    return (Object.keys(request).length > 0)
}
//value validation
const isValidValue = function (value) {   
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true
}




const createurl = async function (req, res) {
    try {
        let url = req.body

        // first we check req.body empty or not
        if(!isValidRequest(url)) return res.status(400).send({status:false,message:"please enter data in body"})
        // we check here if any put empty string or extra space
        if(!isValidValue(url.longUrl)) return res.status(400).send({status:false,message:"please enter valid input"})
        //  we can check  here  url in valid format or not
        if(!urlvalidation(url.longUrl)) return res.status(400).send({status:false,message:"please enter valid url"})

        let val=(Object.keys(url))
        if(!(val.length==1 && val[0]=="longUrl"))
        return res.status(400).send({ status:false,message:"Input only longUrl" })

        
        let urlCode = shortid.generate().toLowerCase()
        let baseurl = "http://localhost:3000/"
        let shortUrl = baseurl + urlCode
        let longUrl = url.longUrl.trim()

        let urldata = { longUrl, shortUrl, urlCode }
        await urlModel.create(urldata)
        res.status(201).send({ message: true, data: urldata })

    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}


const geturl = async (req, res) => {
    try {
        let codeurl = req.params.urlCode
        console.log(codeurl.length)

        if(!shortid.isValid(codeurl)) return res.status(400).send({status:false,message:"please enter valid urlCode"})

    //    ( codeurl.length >= 7  ||codeurl.length <= 14)

        let urlcode1 = await urlModel.findOne({urlCode: codeurl })
        if (!urlcode1) return res.status(404).send({ status: false, message: "The link is not present" })
      
        let link1=urlcode1.longUrl
        
        return res.status(302).redirect(link1 )
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}


module.exports = { createurl, geturl }