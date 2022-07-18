
const urlModel = require("../model/urlmodel")

const urlvalidation = require("url-validation")
const shortid = require("shortid")



const createurl = async function (req, res) {
    try {
        let url = req.body
        let urlCode = shortid.generate(url)

        let baseurl = "http://localhost:3000/"
        let shortUrl = baseurl + urlCode
        let longUrl = url.longUrl

        let urldata = { longUrl, shortUrl, urlCode }
        await urlModel.create(urldata)
        res.status(201).send({ message: true, data: urldata })

    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}


const geturl = async (req, res) => {
    try {
        let link = req.params.urlCode

        let urlcode1 = await urlModel.findOne({urlCode: link })
      
        let link1=urlcode1.longUrl
        if (!urlcode1) return res.status(404).send({ status: false, message: "The link is not present" })
        
        return res.status(307).redirect(link1 )
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}


module.exports = { createurl, geturl }