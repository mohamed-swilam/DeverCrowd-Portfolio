const errorHandler = require("../utils/errorHandler");
const Message = require("../models/message.schema");
const httpResponse = require("../utils/httpResponse");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { sendMail, sendAutoReply } = require("../config/mailer");

const sendForm = asyncWrapper(async (req, res, next) => {
  const { name, email, phoneNumber, title, knownBy, requestedServices,message } =
    req.body;
  const newMessage = new Message({
    name,
    email,
    phoneNumber,
    title,
    knownBy,
    requestedServices,
    message
  });
  await newMessage.save();
  await sendMail({
    name,
    email,
    phoneNumber,
    title,
    knownBy,
    requestedServices,
    message
  });
  await sendAutoReply({ name, email });
  res.json({
    status: httpResponse.status.created,
    message: httpResponse.message.messageCreated,
    data: { newMessage },
  });
});

const GetMessages = asyncWrapper(async (req, res, next) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const skip = limit * (page - 1);
  const messages = await Message.find().sort({ createdAt: -1 }).limit(limit).skip(skip);
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.getMessages,
    data: { messages },
  });
});


const DelMessages = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const message = await Message.findOne({ _id: id });
  if (!message) {
    const error = errorHandler.create(
      httpResponse.message.messageNotFound,
      httpResponse.status.notfound
    );
    return next(error);
  }
  await Message.deleteOne({ _id: id });
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.deleteMessage,
  });
});


module.exports = {
  sendForm,
  GetMessages,
  DelMessages,
};
