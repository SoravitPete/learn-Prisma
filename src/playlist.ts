import express, { Application, Request, Response } from 'express'

const playListRoute = express.Router()

const playlist = [
  {
    type: 'j-pop',
    id : 0,
  },
  {
    type: 'k-pop',
    id : 1,
  }
]

playListRoute.get('/', (_: Request, res: Response) => {
  res.send('Hello World!')
})

playListRoute.get('/playlist', (req: Request, res: Response) => {
  res.send(playlist)
})

playListRoute.get('/playlist/:playlistID', (req: Request, res: Response)  => {
  // req.quer.user
  // req.params.userId
  // req.body
  // res.status(200).send('adfasdf')
  // res.status(200).json({
  //   test: 'test'
  // })
  if (typeof parseInt(req.params.playlistID) !== "number") {
    res.status(404).json({massage : "Not found"})
  }
  else if (isNaN(0 - parseInt(req.params.playlistID))) {
    res.status(404).json({massage : "Pls enter Number"})
  }
  let dummy = parseInt(req.params.playlistID);
  // let ans = playlist.find((item) => item.id == dummy);
  var i = 0;
  while(i < playlist.length) {
    let ans = playlist[i].id
    if (ans === dummy) {
      console.log(ans)
      console.log(typeof(playlist[i]))
      res.send(playlist[i])
    }
    i++
  }
  // console.log(typeof(ans))
  res.send()
})

playListRoute.post('/create', (req: Request, res: Response)  => {
  console.log(req.body);
  if (req.body.type == null){
    res.status(404).json({massage : "Not found"});
  }
  const data = req.body;
  var dummy = playlist.length;
  data.id = dummy;
  playlist.push(data);
  res.send(data)
})

playListRoute.put('/update/:playlistID', (req: Request, res: Response)  => {
  if (typeof parseInt(req.params.playlistID) !== "number"){
    res.status(404).json({massage : "Not found"});
  }
  else if (isNaN(0 - parseInt(req.params.playlistID))){
    res.status(404).json({massage : "Pls enter Number"});
  }
  let dummy = parseInt(req.params.playlistID);
  const new_data = req.body;
  var ans = playlist.find(item => item.id == dummy);
  if (!ans) {
    res.status(404).json({ message: 'Not found'})
    return
  }
  ans.type = new_data.type;
  console.log(typeof(ans));
  res.json({data : new_data});
})

playListRoute.get('/query_by_name', (req: Request, res: Response)  => {
  if (typeof req.query.type !== "string") {
    res.status(404).json({ message: 'Wrong Format'})
    return
  }
  var type = req.query.type;
  var ans = playlist.find(item => item.type === type);
  console.log(ans)
  res.send(ans)
})

playListRoute.get('/query_by_id', (req: Request, res: Response)  => {
  if (typeof req.query.id !== "string") {
    res.status(404).json({ message: 'Wrong Format'})
    return
  }
  var id = parseInt(req.query.id as string);
  var ans = playlist.find(item => item.id === id);
  console.log(ans)
  res.send(ans)
})

playListRoute.delete('/delete/:deleteID', (req: Request, res: Response)  => {
  var del = req.params.deleteID as string;
  let getIndexPlayList = -1
  var ans = playlist.find((item, index) => {
    getIndexPlayList = index
    return item.id === parseInt(del)
  });
  if (!ans) {
    res.status(404).json({ message: 'Not found'})
    return
  }
  playlist.splice(getIndexPlayList, 1)
  // for (var i = 0; i < playlist.length; i++){
  //   if(playlist[i].id === ans.id){

  //   }
  // }
  console.log(ans)
  res.send(ans)
})

export default playListRoute
