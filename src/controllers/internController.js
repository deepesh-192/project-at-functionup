const internModel = require('../models/internModel')
const collegeModel = require('../models/collegeModel')
const validator = require('validator')


// CREATE INTERN

const createIntern = async function (req, res) {
    try {
        let { name, email, mobile } = req.body

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, msg: "please enter a data in request body" })

        if (!name) return res.status(400).send({ status: false, msg: "name is missing" })

        if (typeof name !== "string") return res.status(400).send({ status: false, msg: " Please enter  name as a String" });

        if (! /^\w[a-zA-Z.\s]*$/.test(name)) return res.status(400).send({ status: false, msg: "The  name may contain only letters" });

        if (!email) return res.status(400).send({ status: false, msg: "email is missing" })

        if (typeof email !== "string") return res.status(400).send({ status: false, msg: " Please enter  email as a String" });

        if (!validator.isEmail(email)) return res.status(400).send({ status: false, msg: "Entered email is invalid" });

        if (!mobile) return res.status(400).send({ status: false, msg: "please enter mobile" })

        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)) return res.status(400).send({ status: false, msg: " please enter valid Mobail Number" });

        if (!collegeName) return res.status(400).send({ status: false, msg: "please enter collegeName" })

        if (!/^\w[a-zA-Z.\s]*$/.test(collegeName)) return res.status(400).send({ status: false, msg: "The  collegeName may contain only letters" });

          collegeName = collegeName.toLowerCase();

        if (typeof collegeName !== "string") return res.status(400).send({ status: false, msg: " Please enter  collegeName as a String" });

        let uniqueEmail = await internModel.findOne({ email: email })

        if (uniqueEmail) return res.status(400).send({ status: false, msg: "This email already exists" })

        let uniqueMobailNumber = await internModel.findOne({ mobile: mobile })

        if (uniqueMobailNumber) return res.status(400).send({ status: false, msg: "This mobile already exists" })

        const getCollegeId = await collegeModel.findOne({ name: collegeName });

        if (!getCollegeId) return res.status(404).send({ status: false, message: "College not registered" });
        
// ----------------------------------------------------------
        req.body.collegeId = getCollegeId._id;

        let saveData = await internModel.create(req.body)
        return res.status(201).send({ status: true, msg: "Intern is created Successfully" , data: saveData,})

    } catch (err) {return res.status(500).send({ status: false, msg: err.message })}
}


module.exports.createIntern = createIntern