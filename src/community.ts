import express, { Application, NextFunction, Request, Response } from 'express'

const communityRoute = express.Router()

const dt = Date()

let whole_id : number = 1

const logging = (req: Request, res: Response, next : NextFunction) => {
    console.log('%s %s', req.method, req.url)
    console.log(dt)
    next();
};

//init Middleware
communityRoute.use(logging);

const program_choice = ["ARI", "GG", "GAME", "MUSIC"];

const category_choice = ["A", "B"];

const upload_status_choice = ["DRAFT", "SUCCESS", "CLOSED", "CANCEL"]

const festival_data = [
    {
        festival_id : 0, // create auto
        community_program : "ARI", //** 
        category : "A", //**A,B
        upload_status : "DRAFT", //**Draft, Success, Closed, Cancel
        audience : 100, //**/
        date : '12/04/2023', //** */
        imgage : "https://example.com/xa",
        titleTH : "โอ้วมายก็อดนะ", //** */
        titleEN : "OMG na", //** */
        descriptionTH : "สวัสดีพ่อแม่พี่น้องทุกคนด้วยนะคับ อิอิ", //** */
        descriptionEN : "hello everybody lady and gentle man", //** */
        address : "39/217", //optional
        Lat : 16253, //** */
        Long : 11111, //** */
        companyLink : "www.pete.com", //optional
        Instragram : "SoravitPete", //optional
        Line : "SoravitPete" //optional
    }
]

communityRoute.get('/', (req: Request, res: Response) => {
    console.log('Test1')
    res.send("Test1")
});

communityRoute.get('/api', (req: Request, res: Response) => {
    console.log(festival_data)
    res.json(festival_data)
});

communityRoute.post('/api/create', (req: Request, res: Response) => {
    var data = req.body;
    if (data.community_program !== null && program_choice.includes(data.community_program.toUpperCase())){
        console.log("State Pass1")
    }
    else{
        res.status(404).json({massage : "programs wrong format or invalid DATA"})
        return
    }
    if (data.category !== null && category_choice.includes(data.category.toUpperCase())){
        console.log("State Pass2")
    }
    else{
        res.status(404).json({massage : "category wrong format or invalid DATA"})
        return
    }
    if (data.upload_status !== null && upload_status_choice.includes(data.upload_status.toUpperCase())){
        console.log("State Pass3")
    }
    else{
        res.status(404).json({massage : "status wrong format or invalid DATA"})
        return
    }
    var test_link = data.companyLink.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
    if (test_link !== null){
        console.log("Link state Pass")
    }
    else{
        res.status(404).json({massage : "Invalid Link"})
        return
    }
    var valid_date = Date.parse(data.date) 
    if(isNaN(valid_date) === false){
        console.log("Date state is Pass")
    }
    else{res.status(404).json({massage : "Date is wrong format or not valid"})
        return}
    data.festival_id =  whole_id;
    whole_id += 1
    console.log(data)
    festival_data.push(data)
    res.send(`create community id ${data.id} success`)
});

communityRoute.delete('/api/:festival_id', (req: Request, res: Response) => {
    var id = req.params.festival_id
    var num:number = festival_data.length - 1
    var check = false
    while (num >= 0)  {  
        if (festival_data[num].festival_id == parseInt(id)){
            check = true
            break
        }
        num--;
    }
    if (check){
        festival_data.splice(num, 1)
        console.log(festival_data)
        console.log(num)
        res.send(`delete object community id ${id} success!!!`)
    }
    else{
        res.status(404).json({massage : "dont have a data that you want to delete"})
    }
});

communityRoute.put('/change-date/:festival_id', (req: Request, res: Response) =>{
    var num:number = festival_data.length - 1
    while (num >= 0)  {  
        if (festival_data[num].festival_id === parseInt(req.params.festival_id)){
            festival_data[num].date = req.body.date
            console.log(festival_data[num])
            res.send(festival_data[num])
        }
        num--;
    }
})

communityRoute.get('/find/category', (req: Request, res: Response) =>{
    if (typeof req.query.ct !== "string") {
        res.status(404).json({ message: 'Wrong Format'})
        return
    }
    var ct = req.query.ct.toUpperCase()
    var data = festival_data.filter(item => item.category === ct)
    console.log(data)
    res.send(data)
})

communityRoute.get('/find/upload-status', (req: Request, res: Response) =>{
    if (typeof req.query.st !== "string") {
        res.status(404).json({ message: 'Wrong Format'})
        return
    }
    var st = req.query.st.toUpperCase()
    var data = festival_data.filter(item => item.upload_status === st)
    console.log(data)
    res.send(data)
})

communityRoute.get('/find/category/upload-status', (req: Request, res: Response) =>{
    if (typeof req.query.st !== "string") {
        res.status(404).json({ message: 'Wrong Format'})
        return
    }
    if (typeof req.query.ct !== "string") {
        res.status(404).json({ message: 'Wrong Format'})
        return
    }
    var ct = req.query.ct.toUpperCase()
    var st = req.query.st.toUpperCase()
    var data = festival_data.filter(item => item.category === ct && item.upload_status === st)
    console.log(data)
    res.send(data)
})

export default communityRoute
