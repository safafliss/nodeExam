var message = require ("../models/messageModel");

const addMsg = async (req, res, next) => {
    const { pseudo, content, likes } = req.body;
    let Msg;
    
    try {
        Msg = new message({
            pseudo: pseudo,   
            content: content,
            likes:likes,
      });
      await Msg.save();
    } catch (err) {
      console.log(err);
    }
  
    if (!Msg) {
      return res.status(500).json({ message: "Unable To Add" });
    }
    return res.status(201).json({ Msg });
    //return res.redirect('/chatCrud/listChat');
  };

  const listMsg = async (req, res, next) => {
    try {
      await message.find().then((data) => {
        console.log(data);
        //res.render('listChat.twig', { list: data });
        res.status(200).json(data);
      });
    } catch {
      (err) => res.status(500).json(err);
    }
  };

  const addLikes = async (req, res, next) => {
    const idMsg = req.params.id;
    try {
      await message.findByIdAndUpdate(idMsg, { $inc: { likes: 1 } });
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  const modifMsg = async (req, res, next) => {
    try {
      await message.findByIdAndUpdate(req.params.id, { $set: req.body });
      //res.redirect('/chatCrud/listChat');
      res.status(200).json(itemToUpdate);
    } catch (error) {
      res.json(error);
    }
  };

  const deleteMsg = async (req, res, next) => {
    try {
      await message.findByIdAndDelete(req.params.id);
      res.status(200).json("message deleted !");
    } catch (error) {
      res.json(error);
    }
  };

  const getMsgById = async (req, res, next) => {
    const msgId = req.params.id;
    try {
      const msgData = await message.findOne({ _id: msgId });
      return res.status(200).json({ msgData });
      //console.log(msgData);
      //res.render('updateChat.twig', { chat: chatData });
    } catch (err) {
      res.status(500).json(err);
    }
  };
  

  module.exports = {addMsg, listMsg, addLikes, modifMsg, deleteMsg, getMsgById}